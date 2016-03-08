export default class Queue {

    /*
    *   As the name implies, `consumer` is the (sole) consumer of the queue.
    *   It gets called with each element of the queue and its return value
    *   serves as a ack, determining whether the element is removed or not from
    *   the queue, allowing then subsequent elements to be processed.
    */

    constructor (consumer) {
        this.consumer = consumer;
        this.queue = [];
    }

    push (element) {
        this.queue.push(element);
        this.process();
    }

    process () {
        if (this.queue.length !== 0) {
            const ack = this.consumer(this.queue[0]);
            if (ack) {
                this.queue.shift();
                this.process();
            }
        }
    }

    empty () {
        this.queue = [];
    }

}