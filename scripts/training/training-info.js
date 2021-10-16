
import {sizeNotes} from "../tools.js"

const template = document.querySelector(".tc-training-template")


export class TrainingInfo {
    constructor(trainingData, container) {
        const trInfoFrag = template.content.cloneNode(true)
        const trInfo = trInfoFrag.firstElementChild

        this._notesButton = trInfo.querySelector(".tct-notes-button")
        this._notes = trInfo.querySelector(".tct-notes")

        // Heading
        const heading = trInfo.querySelector(".tct-heading")
        heading.textContent = trainingData.name

        // Notes
        if (trainingData.notes) {
            this._notes.value = trainingData.notes
            this._displayNotes()

            // Note sizing on display
            const observer = new ResizeObserver(() => {
                sizeNotes(this._notes)
                observer.disconnect()
            })
            observer.observe(this._notes)
        }

        // Note sizing
        this._notes.addEventListener("input", sizeNotes)

        container.append(trInfoFrag)
    }

    _displayNotes() {
        this._notesButton.style.display = "none"
        this._notes.style.display = "block"
    }
}


// this._notesButton.addEventListener("click", () => {
//     this._displayNotes()
//     this._notes.focus()
// })