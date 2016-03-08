import EventEmitter from "wolfy87-eventemitter";
import EJSON from "ejson";

export default class Socket extends EventEmitter {

    constructor (SocketConstructor, endpoint) {
        super();
        this.SocketConstructor = SocketConstructor;
        this.endpoint = endpoint;
        this.rawSocket = null;
    }

    send (object) {
        const message = EJSON.stringify(object);
        this.rawSocket.send(message);
        // Emit a copy of the object, as the listener might mutate it.
        this.emit("message:out", EJSON.parse(message));
    }

    open () {

        /*
        *   Makes `open` a no-op if there's already a `rawSocket`. This avoids
        *   memory / socket leaks if `open` is called twice (e.g. by a user
        *   calling `ddp.connect` twice) without properly disposing of the
        *   socket connection. `rawSocket` gets automatically set to `null` only
        *   when it goes into a closed or error state. This way `rawSocket` is
        *   disposed of correctly: the socket connection is closed, and the
        *   object can be garbage collected.
        */
        if (this.rawSocket) {
            return;
        }
        this.rawSocket = new this.SocketConstructor(this.endpoint);

        /*
        *   Calls to `onopen` and `onclose` directly trigger the `open` and
        *   `close` events on the `Socket` instance.
        */
        this.rawSocket.onopen = () => this.emit("open");
        this.rawSocket.onclose = () => {
            this.rawSocket = null;
            this.emit("close");
        };
        /*
        *   Calls to `onerror` trigger the `close` event on the `Socket`
        *   instance, and cause the `rawSocket` object to be disposed of.
        *   Since it's not clear what conditions could cause the error and if
        *   it's possible to recover from it, we prefer to always close the
        *   connection (if it isn't already) and dispose of the socket object.
        */
        this.rawSocket.onerror = () => {
            // It's not clear what the socket lifecycle is when errors occurr.
            // Hence, to avoid the `close` event to be emitted twice, before
            // manually closing the socket we de-register the `onclose`
            // callback.
            delete this.rawSocket.onclose;
            // Safe to perform even if the socket is already closed
            this.rawSocket.close();
            this.rawSocket = null;
            this.emit("close");
        };
        /*
        *   Calls to `onmessage` trigger a `message:in` event on the `Socket`
        *   instance only once the message (first parameter to `onmessage`) has
        *   been successfully parsed into a javascript object.
        */
        this.rawSocket.onmessage = message => {
            var object;
            try {
                object = EJSON.parse(message.data);
            } catch (ignore) {
                // Simply ignore the malformed message and return
                return;
            }
            // Outside the try-catch block as it must only catch JSON parsing
            // errors, not errors that may occur inside a "message:in" event
            // handler
            this.emit("message:in", object);
        };

    }

    close () {
        /*
        *   Avoid throwing an error if `rawSocket === null`
        */
        if (this.rawSocket) {
            this.rawSocket.close();
        }
    }

}