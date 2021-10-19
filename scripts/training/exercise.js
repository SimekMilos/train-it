
import {getWatchString} from "../tools.js"
import {setNextPhase, setPreviousPhase, setStyle} from "./training-tools.js"

import Set from "./set.js"
import {notesFunctionality} from "./notes.js"

const exerciseTemplate = document.querySelector(".tc-exercise-template")


export default class Exercise {
    constructor(exerciseData, container, resizeCallback) {
        const exerciseFrag = exerciseTemplate.content.cloneNode(true)
        const exercise = exerciseFrag.firstElementChild
        this._classList = exercise.classList
        this._exerciseContainer = exercise.querySelector(":scope .tce-container")

        // Name
        const name = exercise.querySelector(":scope .tce-name")
        name.textContent = exerciseData.name

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
                           resizeCallback)
        // Sets
        this._sets = []
        this._activeSetIndex = 0
        for (const setNameStr of exerciseData.sets) {
            this._sets.push(new Set(setNameStr, this._exerciseContainer))
        }

        container.append(exerciseFrag)
    }

    set currentTime(value) {
        this._watchTime = --value
        this._timerTick()
    }

    get currentSet() {
        return this._sets[this._activeSetIndex]
    }

    activate(timer) {
        this._timer = timer
        timer.registerCallback(this._timerTick)

        setStyle(this, this.currentSet.currentPhase)
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
        return nextPhase
    }

    back() {
        let prevPhase
        [prevPhase, this._activeSetIndex] = setPreviousPhase(this._sets,
                                                         this._activeSetIndex,
                                                         this._timer, this)
        setStyle(this, prevPhase)
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
        this._activeSetIndex = 0
        for (const set of this._sets) set.reset()
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
}
