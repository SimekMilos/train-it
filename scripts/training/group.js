
import {float, px, getWatchString} from "../tools.js"
import {setNextPhase, setPreviousPhase} from "./training-tools.js"

import Exercise from "./exercise.js"
import {notesFunctionality} from "./notes.js"

const groupTemplate = document.querySelector(".tc-group-template")
const nogroupTemplate = document.querySelector(".tc-no-group-template")


export default class Group {
    constructor(groupData, container) {
        let groupFrag

        // Group
        if (groupData.type == "group") {
            groupFrag = groupTemplate.content.cloneNode(true)
            this._group = groupFrag.firstElementChild
            this._groupContainer = this._group.querySelector(":scope .tcg-container")

            // Name
            const name = this._group.querySelector("h3")
            name.textContent = groupData.name

            // Watch
            this._watch = this._group.querySelector(":scope .tcg-watch")
            this._watch.textContent = "00:00"
            this._watchTime = 0
            this._timerTick = this._timerTick.bind(this)

            // Notes
            const notes = this._group.querySelector(":scope .tcg-notes")
            const notesButton = this._group.querySelector(":scope .tcg-notes-button")
            notesFunctionality(notes, notesButton, groupData,
                               this._fitWidth.bind(this))

        // No Group
        } else {
            groupFrag = nogroupTemplate.content.cloneNode(true)
            this._group = groupFrag.firstElementChild
            this._groupContainer = this._group
        }

        // Sizing
        const widthObserver = new ResizeObserver(() => this._fitWidth())
        widthObserver.observe(container)

        // Add exercises
        this._exercises = []
        this._activeExerciseIndex = 0
        for (const exerciseData of groupData.exercises) {
            this._exercises.push(new Exercise(exerciseData, this._groupContainer,
                                 this._fitWidth.bind(this)))
        }

        container.append(groupFrag)
    }

    destruct() {
        this._group.remove()
    }

    get currentExercise() {
        return this._exercises[this._activeExerciseIndex]
    }

    set currentTime(value) {
        if (this._watch) {
            this._watchTime = --value
            this._timerTick()
        }
    }

    set isNext(value) {
        this._exercises[0].isNext = value
    }

    activate(timer) {
        this._timer = timer
        if (this._watch) timer.registerCallback(this._timerTick)

        this.isNext = false
        return this._exercises[this._activeExerciseIndex].activate(timer)
    }

    deactivate() {
        if (this._watch) {
            this._timer.removeCallback(this._timerTick)
            this._timer = null
        }
        this._exercises[this._activeExerciseIndex].deactivate()
    }

    next() {
        let nextPhase
        [nextPhase, this._activeExerciseIndex] = setNextPhase(this._exercises,
                                                  this._activeExerciseIndex,
                                                  this._timer)
        this.prepareNextExercise(true)
        return nextPhase
    }

    back() {
        this.prepareNextExercise(false)

        let prevPhase
        [prevPhase, this._activeExerciseIndex] = setPreviousPhase(this._exercises,
                                                  this._activeExerciseIndex,
                                                  this._timer, this)
        return prevPhase
    }

    isLastPhase() {
        if (this._activeExerciseIndex < this._exercises.length - 1) return false
        return this._exercises[this._activeExerciseIndex].isLastPhase()
    }

    prepareNextExercise(isNext) {
        if (this._exercises[this._activeExerciseIndex].isLastPhase() &&
            this._activeExerciseIndex < this._exercises.length - 1){

            this._exercises[this._activeExerciseIndex+1].isNext = isNext
        }
    }

    reset() {
        if (this._watch) {
            this._watch.textContent = "00:00"
            this._watchTime = 0
        }

        if (this._timer) {
            this._timer.removeCallback(this._timerTick)
            this._timer = null
        }

        this._activeExerciseIndex = 0
        for (const exercise of this._exercises) exercise.reset()
    }


    // --- Private ---

    _timerTick() {
        this._watchTime++
        this._watch.textContent = getWatchString(this._watchTime)
    }

    _fitWidth() {
        let first = this._groupContainer.firstElementChild
        const last = this._groupContainer.lastElementChild

        // When first element isn't displayed
        if (getComputedStyle(first).display == "none") {
            first = first.nextElementSibling
        }

        let start = first.getBoundingClientRect().left
        start -= float(getComputedStyle(first).marginLeft)

        let end = last.getBoundingClientRect().right
        end += float(getComputedStyle(last).marginRight)

        this._groupContainer.style.width = px(end - start)
    }
}