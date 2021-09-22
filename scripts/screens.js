
import {wait, waitFor} from "./tools.js"
import * as stopwatch from "./stopwatch/stopwatch.js"
import * as overview from "./overview/overview.js"

const initScreen = document.querySelector(".initial-screen")
const mainScreen = document.querySelector(".main-screen")


// --- Interface ---

export async function initInitScreen() {
    displayScreen(initScreen)

    await wait(500)
    overview.loadTrainings()
    overview.display()
}

export function transitionToMainScreen(training) {
    // training: null - starts timer, obj - starts training

    stopwatch.initStopwatch(training)
    displayScreen(mainScreen)
    hideScreen(initScreen, 1500)
}

export async function transitionToInitScreen() {
    await displayScreen(initScreen, 800)
    hideScreen(mainScreen)

    await wait(200)
    await overview.display()
}


// --- Private ---

async function displayScreen(screen, animationDuration = 0) {
    screen.style.animationDuration = `${animationDuration / 1000}s`

    await wait(0)       // for animation to pick up duration
    screen.classList.add("display")
    if (animationDuration) await waitFor("animationend", screen)
}

async function hideScreen(screen, animationDuration = 0) {
    screen.style.animationDuration = `${animationDuration / 1000}s`

    await wait(0)       // for animation to pick up duration
    screen.classList.add("hide")
    screen.classList.remove("display")

    if (animationDuration) await waitFor("animationend", screen)
    screen.classList.remove("hide")
}
