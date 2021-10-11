
export class Timer {
    constructor() {
        this._timer = null
        this._callbacks = []
    }

    start() {
        if (this._timer) return
        this._timer = setInterval(this._tick.bind(this), 1000)
    }

    stop() {
        if (!this._timer) return

        clearInterval(this._timer)
        this._timer = null
    }

    registerCallback(callback) {
        this._callbacks.push(callback)
    }

    removeCallback(callback) {
        this._callbacks = this._callbacks.filter(val => val != callback)
    }


    // --- Private ---

    _tick() {
        for (const callback of this._callbacks) callback()
    }
}