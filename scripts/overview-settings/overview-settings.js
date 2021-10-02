
import {waitForAny} from "../tools.js"
import * as displayFunc from "./display.js"
import {parseFile, ParserError} from "./file-parser.js"


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
    // Parse storage
    const data = {}
    data["training-order"] = JSON.parse(localStorage["training-order"])

    for (const training of data["training-order"]) {
        data[training] = JSON.parse(localStorage[training])
    }

    // Create data file
    const file = new File([JSON.stringify(data, null, 4)],
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