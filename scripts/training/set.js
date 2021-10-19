
import {getWatchString} from "../tools.js"
import {setStyle} from "./training-tools.js"

const template = document.querySelector(".tc-exercise-set-template")

const defaultName = "Set"


export default class Set {
    constructor(nameStr, container) {
        const setFrag = template.content.cloneNode(true)
        const set = setFrag.firstElementChild
        this._classList = set.classList

        // Name
        const name = set.querySelector(":scope .tcex-name")
        if (!nameStr) name.textContent = defaultName
        else          name.textContent = nameStr

        // Watches
        this._setWatch = set.querySelector(":scope .tcex-set-watch")
        this._pauseWatch = set.querySelector(":scope .tcex-pause-watch")
        this._initWatches()

        this._timerTick = this._timerTick.bind(this)

        container.append(setFrag)
    }

    get currentTime() {
        if (this._activeWatch == this._setWatch) return this._setWatchTime
        return this._pauseWatchTime
    }

    set currentTime(value) {
        if (this._activeWatch == this._setWatch) this._setWatchTime = --value
        else this._pauseWatchTime = --value

        this._timerTick()
    }

    get currentPhase() {
        if (this._activeWatch == this._setWatch) return "set"
        return "pause"
    }

    activate(timer) {
        this._timer = timer
        timer.registerCallback(this._timerTick)

        setStyle(this, this.currentPhase)
        return this.currentPhase
    }

    deactivate() {
        this._timer.removeCallback(this._timerTick)
        this._timer = null

        setStyle(this, null)
    }

    next() {
        if (this._activeWatch == this._setWatch) {
            this._activeWatch = this._pauseWatch

            setStyle(this, "pause")
            return "pause"
        }

        setStyle(this, null)
        return null
    }

    back() {
        this.currentTime = 0

        if (this._activeWatch == this._pauseWatch) {
            this._activeWatch = this._setWatch

            setStyle(this, "set")
            return "set"
        }

        setStyle(this, null)
        return null
    }

    isLast() {
        if (this._activeWatch == this._pauseWatch) return true
        return false
    }

    reset() {
        this._initWatches()
        setStyle(this, null)

        if (this._timer) {
            this._timer.removeCallback(this._timerTick)
            this._timer = null
        }
    }


    // --- Private ---

    _initWatches() {
        this._setWatch.textContent = "00:00"
        this._pauseWatch.textContent = "00:00"
        this._setWatchTime = 0
        this._pauseWatchTime = 0

        this._activeWatch = this._setWatch
    }

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