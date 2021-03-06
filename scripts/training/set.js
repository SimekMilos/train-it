
import {float, range, getWatchString} from "../tools.js"
import {setStyle} from "./training-tools.js"

const template = document.querySelector(".tc-exercise-set-template")

const defaultName = "Set"


export default class Set {
    constructor(nameStr, container) {
        const setFrag = template.content.cloneNode(true)
        this._set = setFrag.firstElementChild
        this._classList = this._set.classList

        // Name
        this._name = this._set.querySelector(":scope .tcex-name")
        if (!nameStr) this._name.textContent = defaultName
        else          this._name.textContent = nameStr

        // Watches
        this._setWatch = this._set.querySelector(":scope .tcex-set-watch")
        this._pauseWatch = this._set.querySelector(":scope .tcex-pause-watch")
        this._initWatches()

        // Sizing
        this._watches = this._set.querySelector(":scope .tcex-watches")
        const firstDisplay = new ResizeObserver(() => {
            firstDisplay.disconnect()
            this._size()
        })
        firstDisplay.observe(this._set)

        this._timerTick = this._timerTick.bind(this)
        container.append(setFrag)
    }

    get name() {
        const parent = this._set.parentElement
        let index

        // Get current set number
        for (index of range(parent.children.length)) {
            if (parent.children[index] == this._set) break
        }

        return `${index}. ${this._name.textContent}`
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

    get isLastPhase() {
        if (this._activeWatch == this._pauseWatch) return true
        return false
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

    getBoundingClientRect() {
        return this._set.getBoundingClientRect()
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

    _size() {
        const setStyle = getComputedStyle(this._set)
        this._set.classList.remove("two-rows")

        const elemsWidth = this._name.clientWidth + this._watches.clientWidth
        const setWidth = this._set.clientWidth - float(setStyle.paddingLeft)
                          - float(setStyle.paddingRight)

        if (elemsWidth > setWidth / 1.02) {         // 2% margin between
            this._set.classList.add("two-rows")     // elements
        }
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