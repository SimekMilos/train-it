
import {getWatchString} from "../tools.js"

import Set from "./set.js"
import {notesFunctionality} from "./notes.js"

const exerciseTemplate = document.querySelector(".tc-exercise-template")


export default class Exercise {
    constructor(exerciseData, container, resizeCallback) {
        const exerciseFrag = exerciseTemplate.content.cloneNode(true)
        const exercise = exerciseFrag.firstElementChild
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

    activate(timer) {
        this._timer = timer
        timer.registerCallback(this._timerTick)

        this._sets[this._activeSetIndex].activate(timer)
    }

    deactivate() {
        this._timer.removeCallback(this._timerTick)
        this._sets[this._activeSetIndex].deactivate()
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
