"""MQTT activity Part 1: publish registration and save the broker response."""
import argparse
import json
from pathlib import Path
import re
import sys
import time

HOST = "161.200.92.6"
PORT = 27004
GROUP_NAME = "Tungtee888"
MAC_ADDRESS = "f0:68:e3:3b:2e:1e"
COMMAND = "register"  # register, publish, or subscribe
TIMEOUT = 30
OUTPUT_FILE = "part1_response.json"
RESPONSE_TOPIC = "IotMsgPlatformPartOne/respond"


def group_name(value):
    if not value.strip() or any(c in value for c in "/+#\0") or value == "respond":
        raise argparse.ArgumentTypeError("group must be nonempty, not 'respond', and contain no /, +, # or NUL")
    return value


def mac_address(value):
    if not re.fullmatch(r"(?:[0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}", value):
        raise argparse.ArgumentTypeError("MAC address must have the form AA:BB:CC:DD:EE:FF")
    return value.upper()


def parse_response(payload, group):
    """Ignore unrelated/malformed messages on the shared response topic."""
    try:
        data = json.loads(payload)
    except (ValueError, UnicodeDecodeError):
        return None
    if not isinstance(data, dict) or data.get("group_id") != group:
        return None
    if data.get("error"):
        raise RuntimeError(f"Broker error: {data['error']}")
    if not isinstance(data.get("v2x_topic"), str) or not data["v2x_topic"].strip():
        return None
    return data


def run(args):
    try:
        import paho.mqtt.client as mqtt
    except ImportError as exc:
        raise RuntimeError("Install dependencies first: cd part1 && uv sync") from exc

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.connect_timeout = args.timeout
    connected = subscribed = False
    response = None
    failure = None

    def on_connect(client, userdata, flags, reason_code, properties):
        nonlocal connected, failure
        if reason_code.is_failure:
            failure = f"Connection rejected: {reason_code}"
            return
        connected = True
        if args.command != "publish":
            result, _ = client.subscribe(RESPONSE_TOPIC, qos=1)
            if result != mqtt.MQTT_ERR_SUCCESS:
                failure = f"Subscribe failed: {result}"

    def on_subscribe(client, userdata, mid, reason_codes, properties):
        nonlocal subscribed, failure
        if not reason_codes or any(code.is_failure for code in reason_codes):
            failure = f"Subscription rejected: {reason_codes}"
        else:
            subscribed = True
            print(f"Subscribed to {RESPONSE_TOPIC}", flush=True)

    def on_message(client, userdata, message):
        nonlocal response, failure
        if message.retain:
            return  # Do not use a stale registration response.
        try:
            response = parse_response(message.payload, args.group) or response
        except RuntimeError as exc:
            failure = str(exc)

    def on_disconnect(client, userdata, flags, reason_code, properties):
        nonlocal failure
        failure = f"Disconnected before completion: {reason_code}"

    client.on_connect = on_connect
    client.on_subscribe = on_subscribe
    client.on_message = on_message
    client.on_disconnect = on_disconnect

    def wait_until(predicate, description):
        deadline = time.monotonic() + args.timeout
        while not predicate():
            if failure:
                raise RuntimeError(failure)
            if time.monotonic() >= deadline:
                raise TimeoutError(f"Timed out waiting for {description}")
            result = client.loop(timeout=min(0.2, max(0, deadline - time.monotonic())))
            if result != mqtt.MQTT_ERR_SUCCESS:
                raise RuntimeError(f"MQTT network error: {mqtt.error_string(result)}")
        if failure:
            raise RuntimeError(failure)

    try:
        client.connect(args.host, args.port, keepalive=60)
        wait_until(lambda: connected, "connection")
        if args.command != "publish":
            wait_until(lambda: subscribed, "subscription acknowledgement")
        if args.command != "subscribe":
            topic = f"IotMsgPlatformPartOne/{args.group}"
            payload = json.dumps({"mac_address": args.mac})
            info = client.publish(topic, payload, qos=1, retain=False)
            if info.rc != mqtt.MQTT_ERR_SUCCESS:
                raise RuntimeError(f"Publish failed: {mqtt.error_string(info.rc)}")
            wait_until(info.is_published, "publish acknowledgement")
            print(f"Published to {topic}: {payload}", flush=True)
        if args.command != "publish":
            wait_until(lambda: response is not None, f"response for group {args.group}")
            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_text(json.dumps(response, indent=2) + "\n", encoding="utf-8")
            print(f"v2x_topic: {response['v2x_topic']}\nSaved to {args.output}")
    finally:
        client.disconnect()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", nargs="?", default=COMMAND, choices=["register", "publish", "subscribe"])
    parser.add_argument("--group", default=GROUP_NAME, type=group_name)
    parser.add_argument("--mac", default=MAC_ADDRESS, type=mac_address)
    parser.add_argument("--host", default=HOST)
    parser.add_argument("--port", type=int, default=PORT)
    parser.add_argument("--timeout", type=float, default=TIMEOUT, help="seconds per network operation")
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parent / OUTPUT_FILE)
    args = parser.parse_args()
    if args.command != "subscribe" and args.mac is None:
        parser.error("--mac is required for publish and register")
    if not 1 <= args.port <= 65535 or not 0 < args.timeout < float("inf"):
        parser.error("port must be 1–65535 and timeout must be finite and positive")
    try:
        run(args)
    except (OSError, RuntimeError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        return 130
    return 0


if __name__ == "__main__":
    sys.exit(main())
