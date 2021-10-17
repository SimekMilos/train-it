
import {sizeNotes} from "../tools.js"

const compContainer = document.querySelector(".tc-container")

let dataStructure


export function setDataStructure(dataStruct) {
    dataStructure = dataStruct
}


export function notesFunctionality(notes, notesButton, objData,
                                   resizeCallback = null) {
    // Initial display
    if (objData.notes) {
        notes.value = objData.notes

        notes.style.display = "block"
        notesButton.style.display = "none"
    }

    // Note sizing
    function sizing() {
        sizeNotes(notes)
        if (resizeCallback) resizeCallback()
    }

    const observer = new ResizeObserver(sizing)
    observer.observe(compContainer)
    notes.addEventListener("input", sizing)

    // Display
    notesButton.addEventListener("click", () => {
        notes.style.display = "block"
        notesButton.style.display = "none"

        if (resizeCallback) resizeCallback()
        notes.focus()
    })

    // Undisplay

    // Save
}