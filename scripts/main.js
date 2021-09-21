
import {wait, waitFor} from "./tools.js"
import * as overview from "./overview/overview.js"

const initScreen = document.querySelector(".initial-screen")


async function onAppLoad() {
    // Deactivate loading screen
    const lScreen = document.querySelector(".loading-screen")
    lScreen.style.display = "none"

    const loadingElem = document.querySelector(".loading-screen p")
    loadingElem.style.animationPlayState = "paused"

    // Display initial view
    displayScreen(initScreen)
    await wait(500)
    overview.loadTrainings()
    overview.display()
}

window.addEventListener("load", onAppLoad)


// --- Screens ---

export async function displayScreen(screen, animationDuration = 0) {
    screen.style.animationDuration = `${animationDuration / 1000}s`

    await wait(0)       // for animation to pick up duration
    screen.classList.add("display")
    await waitFor("animationend", screen)
}

export async function hideScreen(screen, animationDuration = 0) {
    screen.style.animationDuration = `${animationDuration / 1000}s`

    await wait(0)       // for animation to pick up duration
    screen.classList.add("hide")
    screen.classList.remove("display")

    await waitFor("animationend", screen)
    screen.classList.remove("hide")
}
