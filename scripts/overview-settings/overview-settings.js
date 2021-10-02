
import {waitForAny} from "../tools.js"
import * as displayFunc from "./display.js"

const exportButton = document.querySelector(".ovs-export")
const importButton = document.querySelector(".ovs-import")

const fileExtension = ".train-it"
const exportFileName = "trainings" + fileExtension

// --- Public ---

export const isDisplayed = displayFunc.isDisplayed
export const display     = displayFunc.display
export const hide        = displayFunc.hide

export const onStorageRemove = displayFunc.setExportState


// --- Private ---

exportButton.addEventListener("click", onExport)
importButton.addEventListener("click", onImport)


function onExport() {
    // Create data file
    const file = new File([JSON.stringify(localStorage)],
                          exportFileName,
                          {type: "application/octet-stream"})

    // Create link to it
    const a = document.createElement("a")
    a.href = URL.createObjectURL(file)
    a.download = exportFileName

    // Save
    a.click()
    URL.revokeObjectURL(a.href)
}

async function onImport() {
    // Create file input
    const input = document.createElement("input")
    input.type = "file"
    input.accept = fileExtension
    input.click()

    // Wait for interaction
    const canceled = await waitForAny(["change", input, false],
                                      ["click", window, true, true])
    if (canceled) return

    // Parse file
    let fileData
    try {
        fileData = await parseFile(input.files[0])
    } catch (err) {
        if (err instanceof ParserError) {
            if (err.message == "reading-error") alert("File loading not successful.")
            else alert("File cannot be imported. Incorrect file format!")
            return
        } else throw err
    }

    // Save data (override/merge)
    log(fileData)
}


// Parsing file

class ParserError extends Error {
    constructor(message) {
        super(message)
        this.name = "ParserError"
    }
}
async function parseFile(file) {
}
