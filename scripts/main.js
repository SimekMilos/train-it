
import {initInitScreen} from "./screens.js"

export const storageVersion = 1

window.addEventListener("load", onAppLoad)


function onAppLoad() {
    // Deactivate loading screen
    const lScreen = document.querySelector(".loading-screen")
    lScreen.style.display = "none"

    const loadingElem = document.querySelector(".loading-screen p")
    loadingElem.style.animationPlayState = "paused"

    // Initialize application
    initInitScreen()
}