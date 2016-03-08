/**
* DDP.JS 2.1.0
*/


import EventEmitter from "wolfy87-eventemitter";
import Queue from "./queue";
import Socket from "./socket";
import {contains, uniqueId} from "./utils";

const DDP_VERSION = "1";
const PUBLIC_EVENTS = [
    // Subscription messages
    "ready", "nosub", "added", "changed", "removed",
    // Method messages
    "result", "updated",
    // Error messages
    "error"
];
const DEFAULT_RECONNECT_INTERVAL = 10000;

export default class DDP extends EventEmitter {

    emit () {
        setTimeout(super.emit.bind(this, ...arguments), 0);
    }

    constructor (options) {

        super();

        this.status = "disconnected";

        // Default `autoConnect` and `autoReconnect` to true
        this.autoConnect = (options.autoConnect !== false);
        this.autoReconnect = (options.autoReconnect !== false);
        this.reconnectInterval = options.reconnectInterval || DEFAULT_RECONNECT_INTERVAL;

        this.messageQueue = new Queue(message => {
            if (this.status === "connected") {
                this.socket.send(message);
                return true;
            } else {
                return false;
            }
        });

        this.socket = new Socket(options.SocketConstructor, options.endpoint);

        this.socket.on("open", () => {
            // When the socket opens, send the `connect` message
            // to establish the DDP connection
            this.socket.send({
                msg: "connect",
                version: DDP_VERSION,
                support: [DDP_VERSION]
            });
        });

        this.socket.on("close", () => {
            this.status = "disconnected";
            this.messageQueue.empty();
            this.emit("disconnected");
            if (this.autoReconnect) {
                // Schedule a reconnection
                setTimeout(
                    this.socket.open.bind(this.socket),
                    this.reconnectInterval
                );
            }
        });

        this.socket.on("message:in", message => {
            if (message.msg === "connected") {
                this.status = "connected";
                this.messageQueue.process();
                this.emit("connected");
            } else if (message.msg === "ping") {
                // Reply with a `pong` message to prevent the server from
                // closing the connection
                this.socket.send({msg: "pong", id: message.id});
            } else if (contains(PUBLIC_EVENTS, message.msg)) {
                this.emit(message.msg, message);
            }
        });

        if (this.autoConnect) {
            this.connect();
        }

    }

    connect () {
        this.socket.open();
    }

    disconnect () {
        /*
        *   If `disconnect` is called, the caller likely doesn't want the
        *   the instance to try to auto-reconnect. Therefore we set the
        *   `autoReconnect` flag to false.
        */
        this.autoReconnect = false;
        this.socket.close();
    }

    method (name, params) {
        const id = uniqueId();
        this.messageQueue.push({
            msg: "method",
            id: id,
            method: name,
            params: params
        });
        return id;
    }

    sub (name, params) {
        const id = uniqueId();
        this.messageQueue.push({
            msg: "sub",
            id: id,
            name: name,
            params: params
        });
        return id;
    }

    unsub (id) {
        this.messageQueue.push({
            msg: "unsub",
            id: id
        });
        return id;
    }

}