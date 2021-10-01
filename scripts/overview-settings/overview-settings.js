
import * as displayFunc from "./display.js"

const exportButton = document.querySelector(".ovs-export")
const importButton = document.querySelector(".ovs-import")


// --- Public ---

export const isDisplayed = displayFunc.isDisplayed
export const display     = displayFunc.display
export const hide        = displayFunc.hide

export const onStorageRemove = displayFunc.setExportState


// --- Private ---

exportButton.addEventListener("click", onExport)
importButton.addEventListener("click", onImport)


function onExport() {

}

function onImport() {

}