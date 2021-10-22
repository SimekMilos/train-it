
import {getWatchString} from "../tools.js"
import {setNextPhase, setPreviousPhase, setStyle} from "./training-tools.js"
import {smoothScroll} from "../scrolling.js"

import Set from "./set.js"
import {notesFunctionality} from "./notes.js"

const exerciseTemplate = document.querySelector(".tc-exercise-template")
const scrollContainer = document.querySelector(".tc-container")


export default class Exercise {
    constructor(exerciseData, container, resizeCallback) {
        const exerciseFrag = exerciseTemplate.content.cloneNode(true)
        const exercise = exerciseFrag.firstElementChild

        this._exercise = exercise
        this._classList = exercise.classList
        this._exerciseContainer = exercise.querySelector(":scope .tce-container")

        // Header
        this._header = exercise.querySelector(":scope .tce-header")
        this._right = exercise.querySelector(":scope .tce-right")

        const firstDisplay = new ResizeObserver(() => {
            this._sizeHeader(); firstDisplay.disconnect()
        })
        firstDisplay.observe(this._header)

        // Name
        this._name = exercise.querySelector(":scope .tce-name")
        this._name.textContent = exerciseData.name

        // Watch
        this._watch = exercise.querySelector(":scope .tce-watch")
        this._watch.textContent = "00:00"
        this._watchTime = 0
        this._timerTick = this._timerTick.bind(this)

        // Notes
        this._notes = exercise.querySelector(":scope .tce-notes")
        const notesButton = exercise.querySelector(":scope .tce-notes-button")

        this._setupRows()
        notesFunctionality(this._notes, notesButton, exerciseData,
                           resizeCallback, this._sizeHeader.bind(this))
        // Sets
        this._sets = []
        this._activeSetIndex = 0
        for (const setNameStr of exerciseData.sets) {
            this._sets.push(new Set(setNameStr, this._exerciseContainer))
        }

        container.append(exerciseFrag)
    }

    get name() {
        return this._name.textContent
    }

    get currentSet() {
        return this._sets[this._activeSetIndex]
    }

    get nextSet() {
        if (this._activeSetIndex == this._sets.length - 1) return null
        return this._sets[this._activeSetIndex + 1]
    }

    set currentTime(value) {
        this._watchTime = --value
        this._timerTick()
    }

    set isNext(value) {
        this._isNext = value

        if (value) {
            this.scrollTo().then(() => {
                if (this._isNext) this._classList.add("next")
                this.scrollUp()
            })
        } else {
            this._classList.remove("next")
        }
    }

    activate(timer) {
        this._timer = timer
        timer.registerCallback(this._timerTick)

        this.isNext = false
        setStyle(this, this.currentSet.currentPhase)
        if (!this.isLastPhase()) this.scrollActiveSetIntoView()

        return this._sets[this._activeSetIndex].activate(timer)
    }

    deactivate() {
        this._timer.removeCallback(this._timerTick)
        this._timer = null

        setStyle(this, null)
        this._sets[this._activeSetIndex].deactivate()
    }

    next() {
        let nextPhase
        [nextPhase, this._activeSetIndex] = setNextPhase(this._sets,
                                                         this._activeSetIndex,
                                                         this._timer)
        setStyle(this, nextPhase)
        if (!this.isLastPhase()) this.scrollActiveSetIntoView()
        return nextPhase
    }

    back() {
        let prevPhase
        [prevPhase, this._activeSetIndex] = setPreviousPhase(this._sets,
                                                         this._activeSetIndex,
                                                         this._timer, this)
        setStyle(this, prevPhase)
        if (prevPhase) this.scrollActiveSetIntoView()
        else this.isNext = true

        return prevPhase
    }

    isLastPhase() {
        if (this._activeSetIndex < this._sets.length - 1) return false
        return this._sets[this._activeSetIndex].isLastPhase()
    }

    reset() {
        this._watch.textContent = "00:00"
        this._watchTime = 0

        if (this._timer) {
            this._timer.removeCallback(this._timerTick)
            this._timer = null
        }

        setStyle(this, null)
        this.isNext = false
        this._activeSetIndex = 0
        for (const set of this._sets) set.reset()
    }

    async scrollTo() {
        // Get container center
        let {left, right} = scrollContainer.getBoundingClientRect()
        const containerCenter = (left + right)/2

        // Get exercise center
        ;({left, right} = this._exercise.getBoundingClientRect())
        const exerciseCenter = (left + right)/2
        const scrollDist = exerciseCenter - containerCenter

        // Scroll
        await smoothScroll(scrollDist, 250, scrollContainer, true)
    }

    async scrollUp() {
        await smoothScroll(-this._exerciseContainer.scrollTop, 250,
                            this._exerciseContainer)
    }

    async scrollActiveSetIntoView() {
        await this.scrollTo()

        // Get dimensions
        const {top: contTop,
               bottom: contBottom
         } = this._exerciseContainer.getBoundingClientRect()
        const {top: setTop,
               bottom: setBottom
        } = this._sets[this._activeSetIndex].getBoundingClientRect()

        // Get scrolling thresholds
        const setHeight = setBottom - setTop
        const topThreshold = contTop + setHeight
        const bottomThreshold = contBottom - setHeight

        // Compute both scrolling posibitities
        const bottomScrollDist = setBottom - bottomThreshold
        const topScrollDist = setTop - topThreshold

        // Get scroll distance
        let scrollDist = 0
        if (topScrollDist < 0) scrollDist = topScrollDist
        if (bottomScrollDist > 0) scrollDist = bottomScrollDist

        // Scroll
        await smoothScroll(scrollDist, 150, this._exerciseContainer)
    }


    // --- Private ---

    _timerTick() {
        this._watchTime++
        this._watch.textContent = getWatchString(this._watchTime)
    }

    _setupRows() {
        /* Changes row styles while notes are displayed */

        const rowObserver = new MutationObserver(() => {
            if (getComputedStyle(this._notes).display == "none") {
                this._exerciseContainer.classList.remove("odd")
                this._exerciseContainer.classList.add("even")
            } else {
                this._exerciseContainer.classList.remove("even")
                this._exerciseContainer.classList.add("odd")
            }
        })

        const config = {attributes: true, attributeFilter: ["style"]}
        rowObserver.observe(this._notes, config)
    }

    _sizeHeader() {
        this._header.classList.remove("two-rows")

        const elemsWidth = this._name.clientWidth + this._right.clientWidth
        const headerWidth = this._header.clientWidth

        if (elemsWidth > headerWidth / 1.06) {         // 6% margin to allow
            this._header.classList.add("two-rows")     // for font resizing
        }
    }
}
