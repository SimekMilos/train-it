
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

        // Icon
        this._icon = this._trInfo.querySelector(":scope .tct-icon")
        new ResizeObserver(this._iconDisplay.bind(this)).observe(this._icon)

        container.append(trInfoFrag)
    }

    destruct() {
        this._trInfo.remove()
    }


    // --- Private ---

    _iconDisplay() {
        const containerHeight = this._trInfo.clientHeight
        const iconHeight = this._icon.clientHeight
        const ratio = iconHeight / containerHeight

        if (ratio < .15) this._icon.style.opacity = 0
        else this._icon.style.removeProperty("opacity")
    }
}