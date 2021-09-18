
import {px, float} from "../tools.js"

const settingsContainer = document.querySelector(".ov-container")
const settingsComponent = settingsContainer.firstElementChild

const compClassList = settingsComponent.classList
const closeButton = document.querySelector(".ovs-close")

let resolveDisplayChange = null


// --- Interface ---

export function isDisplayed() {
    return compClassList.contains("display")
}

export function display() {
    compClassList.add("display")

    // Resize
    onResize()
    window.addEventListener("resize", onResize)

    // Wait for animation to end
    return new Promise(resolve => resolveDisplayChange = resolve)
}

export function hide() {
    closeButton.disabled = true
    compClassList.add("hide")
    compClassList.remove("display", "enable-access")

    // Resize
    settingsContainer.style.height = 0
    window.removeEventListener("resize", onResize)

    // Wait for animation to end
    return new Promise(resolve => resolveDisplayChange = resolve)
}


// --- Private ---

settingsComponent.addEventListener("animationend", onAnimationEnd)
closeButton.addEventListener("click", hide)


function onAnimationEnd() {
    // Displaying
    if(compClassList.contains("display")) {
        compClassList.add("enable-access")

    // Hiding
    } else {
        compClassList.remove("hide")
        closeButton.disabled = false
    }

    resolveDisplayChange()
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

    // floatingMode(true)
}