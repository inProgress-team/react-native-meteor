/* globals EV:true */
/* exported EV */

EV = class EV {
	constructor() {
		this.handlers = {};
	}

	emit(event, ...args) {
		if (this.handlers[event]) {
			this.handlers[event].forEach((handler) => handler.apply(this, args));
		}
	}

	emitWithScope(event, scope, ...args) {
		if (this.handlers[event]) {
			this.handlers[event].forEach((handler) => handler.apply(scope, args));
		}
	}

	on(event, callback) {
		if (!this.handlers[event]) {
			this.handlers[event] = [];
		}
		this.handlers[event].push(callback);
	}

	once(event, callback) {
		self = this;
		self.on(event, function onetimeCallback() {
			callback.apply(this, arguments);
			self.removeListener(event, onetimeCallback);
		});
	}

	removeListener(event, callback) {
		if(this.handlers[event]) {
			const index = this.handlers[event].indexOf(callback);
			if (index > -1) {
				this.handlers[event].splice(index, 1);
			}
		}
	}

	removeAllListeners(event) {
		this.handlers[event] = undefined;
	}
};