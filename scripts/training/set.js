
import {getWatchString} from "../tools.js"

const template = document.querySelector(".tc-exercise-set-template")

const defaultName = "Set"


export default class Set {
    constructor(nameStr, container) {
        const setFrag = template.content.cloneNode(true)
        const set = setFrag.firstElementChild

        // Name
        const name = set.querySelector(":scope .tcex-name")
        if (!nameStr) name.textContent = defaultName
        else          name.textContent = nameStr

        // Watches
        this._setWatch = set.querySelector(":scope .tcex-set-watch")
        this._pauseWatch = set.querySelector(":scope .tcex-pause-watch")
        this._setWatch.textContent = "00:00"
        this._pauseWatch.textContent = "00:00"
        this._setWatchTime = 0
        this._pauseWatchTime = 0
        this._timerTick = this._timerTick.bind(this)

        this._activeWatch = this._setWatch

        container.append(setFrag)
    }

    activate(timer) {
        this._timer = timer
        timer.registerCallback(this._timerTick)

        if (this._activeWatch == this._setWatch) return "set"
        else return "pause"
    }

    deactivate() {
        this._timer.removeCallback(this._timerTick)
    }

    next() {
        if (this._activeWatch == this._setWatch) {
            this._activeWatch = this._pauseWatch
            return "pause"
        }

        return null
    }

    back() {
        if (this._activeWatch == this._pauseWatch) {
            this._activeWatch = this._setWatch
            return "set"
        }

        return null
    }

    isLast() {
        if (this._activeWatch == this._pauseWatch) return true
        return false
    }


    // --- Private ---

    _timerTick() {
        if (this._activeWatch == this._setWatch) {
            this._setWatchTime++
            this._setWatch.textContent = getWatchString(this._setWatchTime)
        } else {
            this._pauseWatchTime++
            this._pauseWatch.textContent = getWatchString(this._pauseWatchTime)
        }
    }
}