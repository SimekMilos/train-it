
import {sizeNotes} from "../tools.js"

const template = document.querySelector(".tc-training-template")


export default class TrainingInfo {
    constructor(trainingData, container) {
        const trInfoFrag = template.content.cloneNode(true)
        this._trInfo = trInfoFrag.firstElementChild

        // Name
        const name = this._trInfo.querySelector(":scope .tct-heading")
        name.textContent = trainingData.name

        // Notes
        const notes = this._trInfo.querySelector(":scope .tct-notes")
        const notesButton = this._trInfo.querySelector(":scope .tct-notes-button")

        if (trainingData.notes) {
            notes.value = trainingData.notes

            notes.style.display = "block"
            notesButton.style.display = "none"
        }

        // Note sizing
        notes.addEventListener("input", sizeNotes)
        const observer = new ResizeObserver(() => sizeNotes(notes))
        observer.observe(container)

        container.append(trInfoFrag)
    }

    destruct() {
        this._trInfo.remove()
    }
}


// this._notesButton.addEventListener("click", () => {
//     this._displayNotes()
//     this._notes.focus()
// })