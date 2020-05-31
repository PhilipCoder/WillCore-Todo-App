/**
 * Basic queueing class, first in, first out.
 * Author: Philip Schoeman
 */
class queue{
    constructor() {
        this.items = [];
    }

    /**
     * Adds an item to the end of the queue
     * @param {Any} item 
     */
    enqueue(item){
        this.items.push(item);
    }

    /**
     * Return and removes the fist item in the queue.
     */
    dequeue(){
        return this.items.shift();
    }

    /**
     * Returns the first item in the queue.
     */
    peek(){
        return this.items[0];
    }

    /**
     * Returns true if the queue is empty, false if the queue contains elements.
     */
    isEmpty(){
        return this.items.length === 0;
    }
}

module.exports = queue;