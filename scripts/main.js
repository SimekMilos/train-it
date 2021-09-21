
import {wait} from "./tools.js"
import * as overview from "./overview/overview.js"


window.addEventListener("load", onAppLoad)

async function onAppLoad() {
    // Deactivate loading screen
    const lScreen = document.querySelector(".loading-screen")
    lScreen.style.display = "none"

    const loadingElem = document.querySelector(".loading-screen p")
    loadingElem.style.animationPlayState = "paused"

    // Setup overview component
    await wait(500)
    overview.loadTrainings()
    overview.display()
}
