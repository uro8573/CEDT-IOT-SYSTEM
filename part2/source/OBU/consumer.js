let {
    setActiveStatus,
    setLatitude,
    setLongitude,
    setSpeed,
    setColor,
} = require('./obu.js');
const mqtt = require('mqtt')

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const BROKER_URL = 'mqtt://161.200.92.6:27004';
const V2X_TOPIC = 'IotMsgPlatformPartTwo/louisiana-stairway-mobile-one';
const topics = ['speed', 'heartbeat', 'route'].map(type => `${V2X_TOPIC}/${type}`);
const colors = new Set(['blue', 'green', 'red', 'violet', 'yellow', 'no']);

const client = mqtt.connect(BROKER_URL, {
    connectTimeout: 5000,
    reconnectPeriod: 1000,
});

client.on('connect', () => {
    client.subscribe(topics, { qos: 0 }, (error, granted) => {
        if (error || granted.some(item => item.qos === 128)) {
            console.error('MQTT subscription failed:', error || granted);
            return;
        }
        console.log(`Subscribed to ${topics.join(', ')}`);
    });
});
client.on('error', error => console.error('MQTT error:', error.code, error.message));
client.on('offline', () => setActiveStatus(false));

client.on('message', (topic, payload) => {
    if (!topics.includes(topic)) return;
    console.log(`[MQTT received] ${topic}: ${payload.toString()}`);
    try {
        const data = JSON.parse(payload.toString());
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            throw new Error('Expected a JSON object');
        }

        if (topic === `${V2X_TOPIC}/speed`) {
            if (!Number.isFinite(data.speed) || data.speed < 0) {
                throw new Error('Invalid speed');
            }
            setSpeed(data.speed);
        } else if (topic === `${V2X_TOPIC}/heartbeat`) {
            if (typeof data.heartbeat === 'boolean') {
                setActiveStatus(data.heartbeat);
            } else if (data.heartbeat === 'ACTIVE' || data.heartbeat === 'INACTIVE') {
                setActiveStatus(data.heartbeat === 'ACTIVE');
            } else {
                throw new Error('Heartbeat must be a boolean, ACTIVE, or INACTIVE');
            }
        } else {
            if (!Number.isFinite(data.latitude) || Math.abs(data.latitude) > 90 ||
                !Number.isFinite(data.longitude) || Math.abs(data.longitude) > 180 ||
                !colors.has(data.color)) {
                throw new Error('Invalid route coordinates or color');
            }
            setLatitude(data.latitude);
            setLongitude(data.longitude);
            setColor(data.color);
        }
    } catch (error) {
        console.error(`Ignoring invalid payload on ${topic}:`, error.message);
    }
});

// setSpeed(number) : Use this function to set the vehicle's speed (km/hr), e.g. setSpeed(50)
// setActiveStatus(boolean) : Use this function to set the vehicle's online status (true=Active, false=Inactive), e.g. setActiveStatus(true)
// setLatitude(number), setLongitude(number) : Use these functions to set the vehicle's location
    // e.g. setLatitude(13.738044), setLongitude(100.529944)
// setColor(string) : Use this function to set the vehicle-pin's color, e.g. setColor("blue")
    // valid colors are "blue", "green", "red", "violet", "yellow", "no"
