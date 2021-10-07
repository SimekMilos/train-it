
export class Timer {
    constructor() {
        this._timer = null
        this._callbacks = []
    }

    start() {
        if (this._timer) return
        this._timer = setInterval(this._trigger.bind(this), 1000)
    }

    stop() {
        if (!this._timer) return

        clearInterval(this._timer)
        this._timer = null
    }

    registerCallback(callback) {
        this._callbacks.push(callback)
    }

    _trigger() {
        for (const callback of this._callbacks) callback()
    }
}