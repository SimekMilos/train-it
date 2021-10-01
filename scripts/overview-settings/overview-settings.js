
import * as displayFunc from "./display.js"

const exportButton = document.querySelector(".ovs-export")
const importButton = document.querySelector(".ovs-import")

const exportFileName = "trainings.train-it"

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

function onImport() {

}
