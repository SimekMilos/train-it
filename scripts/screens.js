
import {wait, waitFor} from "./tools.js"
import * as overview from "./overview/overview.js"

const initScreen = document.querySelector(".initial-screen")
const mainScreen = document.querySelector(".main-screen")


export async function initInitScreen() {
    displayScreen(initScreen)

    await wait(500)
    overview.loadTrainings()
    overview.display()
}

export async function transitionToMainScreen(training) {
    // training - training data obj/null
}

// Transition to main screen
    // Hide initial screen
    // await hideScreen(initialScreen, 700)

    // initialize components - watch will be main - so call init function for watch component
         // která má parametr - tréning/null (rozlišení timer/training)

    // display main screen - zde nebo ve watch komponentové funkci?



async function displayScreen(screen, animationDuration = 0) {
    screen.style.animationDuration = `${animationDuration / 1000}s`

    await wait(0)       // for animation to pick up duration
    screen.classList.add("display")
    await waitFor("animationend", screen)
}

async function hideScreen(screen, animationDuration = 0) {
    screen.style.animationDuration = `${animationDuration / 1000}s`

    await wait(0)       // for animation to pick up duration
    screen.classList.add("hide")
    screen.classList.remove("display")

    await waitFor("animationend", screen)
    screen.classList.remove("hide")
}
