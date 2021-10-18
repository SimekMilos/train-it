
import {initInitScreen} from "./screens.js"

export const storageVersion = 1

window.addEventListener("load", onAppLoad)
window.addEventListener("DOMContentLoaded", centerButtonText)


function onAppLoad() {
    // Deactivate loading screen
    const lScreen = document.querySelector(".loading-screen")
    lScreen.style.display = "none"

    const loadingElem = document.querySelector(".loading-screen p")
    loadingElem.style.animationPlayState = "paused"

    // Initialize application
    initInitScreen()
}

function centerButtonText() {
    const buttons = document.querySelectorAll("button")

    for (const button of buttons) {
        if (!button.textContent.trim()) continue

        const buttonText = button.textContent.trim()
        button.textContent = ""

        const centerElem = document.createElement("div")
        centerElem.classList.add("center-font")
        centerElem.textContent = buttonText

        button.append(centerElem)
    }
}
