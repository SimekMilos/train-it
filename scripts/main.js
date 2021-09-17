
import * as overview from "./comp-overview/overview.js"


window.addEventListener("load", onAppLoad)

function onAppLoad() {
    // Deactivate loading screen
    const lScreen = document.querySelector(".loading-screen")
    lScreen.style.display = "none"

    const loadingElem = document.querySelector(".loading-screen p")
    loadingElem.style.animationPlayState = "paused"

    // Display overview component
    overview.displayComponent()
}
