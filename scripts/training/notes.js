
import {sizeNotes} from "../tools.js"
import * as stopwatch from "../stopwatch/stopwatch.js"

const mainScreen = document.querySelector(".main-screen")

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
    observer.observe(mainScreen)
    notes.addEventListener("input", sizing)

    // Display
    notesButton.addEventListener("click", () => {
        notes.style.display = "block"
        notesButton.style.display = "none"

        if (resizeCallback) resizeCallback()
        notes.focus()
    })

    // Undisplay
    notes.addEventListener("blur", () => {
        if (notes.value) return             // Only when empty

        notes.style.display = "none"
        notesButton.style.display = "block"

        if (resizeCallback) resizeCallback()
    })

    // Save
    notes.addEventListener("change", () => {
        const newValue = notes.value.trimEnd()
        if (objData.notes == newValue) return

        objData.notes = newValue
        dataStructure.store()
    })

    // Disable spacebar functionality while typing
    notes.addEventListener("focus", stopwatch.deactivateSpacebar)
    notes.addEventListener("blur", stopwatch.activateSpacebar)
}