
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

    // Wait for user interaction
    const canceled = await waitForAny(["change", input, false],
                                      ["click", window, true, true])
    if (canceled) return

    // Load file
    const reader = new FileReader()
    reader.readAsText(input.files[0])
    const success = await waitForAny(["load", reader, true],
                                     ["errror", reader, false])
    if (!success) {
        alert("File loading not successful.")
        return
    }

    // Parse file
    let fileData
    try {
        fileData = parseFile(reader.result)
    } catch (err) {
        if (err instanceof ParserError) {
            alert("File cannot be imported. Incorrect file format!")
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

function parseFile(data) {
    // Parse storage structure
    try {
        data = JSON.parse(data)
        for (const key in data) data[key] = JSON.parse(data[key])
    } catch {
        throw new ParserError
    }

    // Test order array
    if (!checkOrderArray(data)) throw new ParserError

    // Test trainings
    for (const trID of data["training-order"]) {
        if (!checkTraining(data[trID])) {
            throw new ParserError
        }
    }

    return data
}

function checkOrderArray(data) {
    const orderArray = data["training-order"]

    // Check array
    if (!(orderArray instanceof Array)) return false
    if (!orderArray.length) return false

    // Check ids
    for (const id of orderArray) {
        if (typeof id != "string") return false
        if (!id.trim().length) return false

        // check arr id - training id bindings
        if (!(data[id] instanceof Object)) return false
    }

    return true
}

function checkTraining(training) {
function parseName(obj) {
    if (typeof obj.name != "string") return false
    obj.name = obj.name.trim()

    // Name cannot be empty
    if (!obj.name.length) return false
    return true
}

function parseNotes(obj) {
    if (typeof obj.notes != "string") return false
    obj.notes = obj.notes.trimEnd()

    return true
}