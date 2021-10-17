
import {sizeNotes} from "../tools.js"
import Set from "./set.js"

const exerciseTemplate = document.querySelector(".tc-exercise-template")


export default class Exercise {
    constructor(exerciseData, container) {
        const exerciseFrag = exerciseTemplate.content.cloneNode(true)
        const exercise = exerciseFrag.firstElementChild
        this._exerciseContainer = exercise.querySelector(":scope .tce-container")

        // Name
        const name = exercise.querySelector(":scope .tce-name")
        name.textContent = exerciseData.name

        // Notes
        this._notes = exercise.querySelector(":scope .tce-notes")
        const notesButton = exercise.querySelector(":scope .tce-notes-button")
        this._setupRows()

        if (exerciseData.notes) {
            this._notes.value = exerciseData.notes

            this._notes.style.display = "block"
            notesButton.style.display = "none"
        }

        // Notes sizing
        // notes.addEventListener("input", sizeNotes)
        const observer = new ResizeObserver(() => sizeNotes(this._notes))
        observer.observe(this._notes)

        // Sets
        const sets = []
        for (const setNameStr of exerciseData.sets) {
            sets.push(new Set(setNameStr, this._exerciseContainer))
        }

        container.append(exerciseFrag)
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
