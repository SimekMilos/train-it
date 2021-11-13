
import {waitForAny, dialog,
        asyncContextManager, generateTrainingID} from "../tools.js"
import {storageVersion} from "../main.js"

import * as overview from "../overview/overview.js"
import {parseFile, ParserError} from "./file-parser.js"


const exportButton = document.querySelector(".ovs-export")
const importButton = document.querySelector(".ovs-import")

const fileExtension = ".trainit"
const exportFileName = "trainings" + fileExtension


// --- Public ---

export {
    display,
    hide,
    isDisplayed,
    setExportState as onStorageRemove
} from "./display.js"


// --- Private ---

exportButton.addEventListener("click", onExport)
importButton.addEventListener("click", onImport)


function onExport() {
    // Parse storage
    const data = {"storage-version": storageVersion}
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

    overlayContext(async () => {
        // Load file
        const reader = new FileReader()
        reader.readAsText(input.files[0])
        const success = await waitForAny(["load", reader, true],
                                         ["error", reader, false])
        if (!success) {
            await dialog("File loading not successful.", "OK")
            return
        }

        // Parse file
        let fileData
        try {
            fileData = parseFile(reader.result)
        } catch (err) {
            if (err instanceof ParserError) {
                await dialog("File cannot be imported. Incorrect file format!", "OK")
                return
            } else throw err
        }

        // Ask for action (only if app isn't empty)
        if (localStorage["training-order"]) {
            const action = await dialog("You have trainings in the app. \
                Do you want to add imported trainings to existing ones or \
                replace them?", "Add", "Replace", "Cancel")

            if (action == "Cancel") return
            if (action == "Replace") localStorage.clear()
        }

        // Save data
        mergeData(fileData)
        overview.loadTrainings()
    })
}

function mergeData(fileData) {
    const storage = localStorage

    storage["storage-version"] = storageVersion

    // Get order array
    let orderArr = storage["training-order"]
    if (orderArr) orderArr = JSON.parse(orderArr)
    else orderArr = []

    // Save new trainings
    for (const fileID of fileData["training-order"]) {
        const localID = generateTrainingID()

        orderArr.push(localID)
        storage[localID] = JSON.stringify(fileData[fileID])
    }

    // Save order
    if (!orderArr.length) throw new Error("Order array empty after import")
    storage["training-order"] = JSON.stringify(orderArr)
}

// Disables application until importing is finished
const overlayContext = asyncContextManager(() => {
    const overlay = document.createElement("div")
    const style = overlay.style

    style.position = "absolute"
    style.top = 0
    style.left = 0
    style.right = 0
    style.bottom = 0
    style.zIndex = 1

    document.body.append(overlay)
    return overlay

}, (overlay) => {
    overlay.remove()
})