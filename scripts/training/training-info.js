
import {notesFunctionality} from "./notes.js"

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
        notesFunctionality(notes, notesButton, trainingData)

        container.append(trInfoFrag)
    }

    destruct() {
        this._trInfo.remove()
    }
}