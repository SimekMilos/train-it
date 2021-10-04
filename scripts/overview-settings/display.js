
import {px, float, waitFor} from "../tools.js"
import * as overview from "../overview/overview.js"

const settingsContainer = document.querySelector(".ov-container")
const settingsComponent = settingsContainer.firstElementChild
const overviewComponent = document.querySelector(".overview-component")

const compClassList = settingsComponent.classList
const closeButton = document.querySelector(".ovs-close")
const exportButton = document.querySelector(".ovs-export")

let floatingModeActive = false


// --- Interface ---

export function isDisplayed() {
    return compClassList.contains("display")
}

export async function display() {
    compClassList.add("display")
    floatingMode("display")

    setExportState()

    // Resize
    onResize()
    window.addEventListener("resize", onResize)

    // Enable access when displayed
    await waitFor("animationend", settingsComponent)
    compClassList.add("enable-access")
}

export async function hide() {
    closeButton.disabled = true
    compClassList.add("hide")
    compClassList.remove("display", "enable-access")
    floatingMode("hide")

    // Resize
    settingsContainer.style.height = 0
    window.removeEventListener("resize", onResize)

    // Clean up when hidden
    await waitFor("animationend", settingsComponent)
    compClassList.remove("hide")
    closeButton.disabled = false
    exportButton.disabled = false
}

export function setExportState() {
    // Disable export if there is nothing to export

    if (!localStorage["training-order"]) {
        exportButton.disabled = true
    }
}


// --- Private ---

closeButton.addEventListener("click", onCloseClick)


async function onCloseClick() {
    overview.settingsButtonDisabling(true)
    await hide()
    overview.settingsButtonDisabling(false)
}

function onResize() {
    // Prevent resize change during hiding animation
    if(!compClassList.contains("display")) return

    // Get dimensions
    const currentHeight = float(settingsContainer.style.height)
    let newHeight = settingsComponent.getBoundingClientRect().height
    newHeight += float(getComputedStyle(settingsComponent).marginTop)

    // Resize
    if (currentHeight != newHeight) {
        settingsContainer.style.height = px(newHeight)
    }

    floatingMode("resize")
}


// Floating mode

function floatingMode(mode) {
    /* Floats component over overview component if there is not enough
       vertical space */

    // Getting heights
    const minOverview = float(window.getComputedStyle(overviewComponent).minHeight)
    const currentSettings = settingsComponent.getBoundingClientRect().height
    const activate = (minOverview + currentSettings + 44) >= window.innerHeight

    // Toggle on component display/hide
    if (mode == "display" && activate) {
        activateFloatingMode(true)
    }

    if (mode == "hide" && activate) {
        deactivateFloatingMode(true)
    }

    // Toggle on resize
    if (mode == "resize" && !floatingModeActive && activate) {
        activateFloatingMode(false)
    }

    if (mode == "resize" && floatingModeActive && !activate) {
        deactivateFloatingMode(false)
    }

    // Set width
    if (floatingModeActive) {
        const overviewWidth = window.getComputedStyle(overviewComponent).width
        settingsContainer.style.width = px(float(overviewWidth) - 30)
    }
}

function activateFloatingMode(animate) {
    floatingModeActive = true
    overview.disable(animate ? 400 : 0)

    // Set up position
    const style = settingsContainer.style
    style.position = "absolute"
    style.transform = "translate(-50%, -50%)"
}

async function deactivateFloatingMode(animate) {
    floatingModeActive = false
    overview.enable(animate ? 400 : 0)

    function remove() {
        const style = settingsContainer.style
        style.removeProperty("position")
        style.removeProperty("transform")
        style.removeProperty("width")
    }

    if (!animate) remove()
    else {
        await waitFor("animationend", settingsComponent)
        remove()
    }
}