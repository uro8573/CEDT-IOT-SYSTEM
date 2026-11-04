// OBU
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "./.env") });

const { createServer } = require("http");
const { Server } = require("socket.io");

const port = process.env.OBU_SOCKET_PORT || 8002;
const id = process.env.CAR_IDENTIFIER;

// logging
const fs = require("fs");
const util = require("util");
const log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "a" });
const log_stdout = process.stdout;

console.log = function (d) {
    //
    log_file.write(new Date() + "\t" + util.format(d) + "\n");
    log_stdout.write(new Date() + "\t" + util.format(d) + "\n");
};

// Default values
let isActive = false;
let speed = 0.0;
let latitude = 13.738044;
let longitude = 100.529944;
let color = "no";

const initServer = () => {
    // init server for send to frontend
    const httpServer = createServer();
    const frontendIo = new Server(httpServer, {
        transports: ["websocket", "polling"],
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
        allowEIO3: true,
        closeOnBeforeunload: true,
    });

    // socket (send to OBU frontend)
    frontendIo.on("connection", async (socket) => {
        console.log("Connected to the frontend");

        socket.on("disconnect", () => {
            console.log("Frontend disconnected.");
        });
    });

    const emitCarInfo = setInterval(() => {
        if (isActive) {
            message = {
                id: id,
                velocity: speed,
                unit: "km/h",
                latitude: latitude,
                longitude: longitude,
                timestamp: new Date(),
                color: color,
            };
            frontendIo.emit("car info", message);
        }
    }, 1000);

    httpServer.listen(port, () => {
        console.log(`server running at http://localhost:${port}`);
    });

    return {
        httpServer,
        frontendIo,
        emitCarInfo,
    };
};

// start server
const start = () => {
    const { httpServer, frontendIo, emitCarInfo } = initServer();

    const intervalList = [emitCarInfo];

    // error handler
    process.on("uncaughtException", (err) => {
        console.error("Uncaught Exception:", err);
        // restartServer(httpServer, intervalList, producerList);
        cleanup(intervalList, frontendIo, httpServer);
        process.exit(0);
    });

    process.on("unhandledRejection", (err, promise) => {
        console.error("Unhandled Promise Rejection:", err);
        // restartServer(httpServer, intervalList, producerList);
        cleanup(intervalList, frontendIo, httpServer);
        process.exit(0);
    });

    process.on("SIGINT", () => {
        console.log("Received SIGINT. Shutting down gracefully...");
        cleanup(intervalList, frontendIo, httpServer);
        process.exit(0);
    });

    process.on("SIGTERM", () => {
        console.log("Received SIGTERM. Shutting down gracefully...");
        cleanup(intervalList, frontendIo, httpServer);
        process.exit(0);
    });
};

const cleanup = (intervalList, serverSocket, httpServer) => {
    intervalList.forEach((item) => {
        clearInterval(item);
    });

    serverSocket.close(() => {
        console.log("Close OBU Socket Server");
    });

    httpServer.close(() => {
        console.log("Server closed");
    });
};

// restart
const restartServer = (httpServer, intervalList) => {
    intervalList.forEach((item) => {
        clearInterval(item);
    });

    httpServer.close(() => {
        console.log("Server closed. Restarting...");
        start();
    });
};

start();

module.exports = {
    // isActive
    getActiveStatus: function () {
        return isActive;
    },
    setActiveStatus: function (active) {
        isActive = active;
    },

    // speed
    getSpeed: function () {
        return speed;
    },
    setSpeed: function (newSpeed) {
        speed = newSpeed;
    },

    // latitude
    getLatitude: function () {
        return latitude;
    },
    setLatitude: function (newLatitude) {
        latitude = newLatitude;
    },

    // longitude
    getLongitude: function () {
        return longitude;
    },
    setLongitude: function (newLongitude) {
        longitude = newLongitude;
    },

    // color
    getColor: function () {
        return color;
    },
    setColor: function (newColor) {
        color = newColor;
    },
};
