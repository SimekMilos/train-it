
import {sizeNotes} from "../tools.js"

const template = document.querySelector(".tc-training-template")


export class TrainingInfo {
    constructor(trainingData, container) {
        const trInfoFrag = template.content.cloneNode(true)
        const trInfo = trInfoFrag.firstElementChild

        // Heading
        const heading = trInfo.querySelector(":scope .tct-heading")
        heading.textContent = trainingData.name

        // Notes
        const notes = trInfo.querySelector(":scope .tct-notes")
        const notesButton = trInfo.querySelector(":scope .tct-notes-button")

        if (trainingData.notes) {
            notes.value = trainingData.notes

            notes.style.display = "block"
            notesButton.style.display = "none"

            // Note sizing on display
            const observer = new ResizeObserver(() => {
                sizeNotes(notes)
                observer.disconnect()
            })
            observer.observe(notes)
        }

        // Note sizing
        notes.addEventListener("input", sizeNotes)

        container.append(trInfoFrag)
    }
}


// this._notesButton.addEventListener("click", () => {
//     this._displayNotes()
//     this._notes.focus()
// })