
import {sizeNotes} from "../tools.js"
import Set from "./set.js"

const exerciseTemplate = document.querySelector(".tc-exercise-template")
const notesTemplate = document.querySelector(".tc-notes-template")


export default class Exercise {
    constructor(exerciseData, container) {
        const exerciseFrag = exerciseTemplate.content.cloneNode(true)
        const exercise = exerciseFrag.firstElementChild
        const exerciseContainer = exercise.querySelector(":scope .tce-container")

        // Name
        const name = exercise.querySelector(":scope .tce-name")
        name.textContent = exerciseData.name

        // Notes
        const notesButton = exercise.querySelector(":scope .tce-notes-button")

        if (exerciseData.notes) {
            const notesFrag = notesTemplate.content.cloneNode(true)
            const notes = notesFrag.firstElementChild
            notes.value = exerciseData.notes
            exerciseContainer.append(notesFrag)

            notesButton.style.display = "none"

            // Note sizing on display
            const observer = new ResizeObserver(() => {
                sizeNotes(notes)
                observer.disconnect()

                // resize group here
            })
            observer.observe(notes)
        }

        // Notes sizing
        // notes.addEventListener("input", sizeTrainingNotes)

        // Sets
        const sets = []
        for (const setNameStr of exerciseData.sets) {
            sets.push(new Set(setNameStr, exerciseContainer))
        }

        container.append(exerciseFrag)
    }
}
