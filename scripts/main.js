
import * as overview from "./overview/overview.js"


window.addEventListener("load", onAppLoad)

function onAppLoad() {
    // Deactivate loading screen
    const lScreen = document.querySelector(".loading-screen")
    lScreen.style.display = "none"

    const loadingElem = document.querySelector(".loading-screen p")
    loadingElem.style.animationPlayState = "paused"

    // Setup overview component
    overview.loadTrainings()
    overview.display()
}
