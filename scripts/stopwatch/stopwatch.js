
import {transitionToInitScreen} from "../screens.js"
import * as settings from "../settings/settings.js"

import * as sizing from "./sizing.js"
import * as display from "./display.js"
import * as watches from "./watches.js"
import * as trainingMode from "./training-mode.js"
import * as timerMode from "./timer-mode.js"

const buttonStart = document.querySelector(".st-start")
const buttonStop = document.querySelector(".st-stop")
const buttonContinue = document.querySelector(".st-continue")
const buttonNext = document.querySelector(".st-next")
const buttonFinish = document.querySelector(".st-finish")

let trainingData = null
let trainingInProgress = false


// --- Public ---

export function init(trData) {
    /* trData: null - starts timer, obj - starts training */

    sizing.activate()
    display.buttons.initialMode()
    trainingData = trData

    watches.resetCurrentWatchTime()
    watches.resetTotalWatchTime()

    // Set initial watch display
    if (!trData) display.watches.timerMode()
    else {
        const startDelay = settings.getTrainingStartDelay()

        if (!startDelay) display.watches.initialMode()
        else {
            display.watches.countDownMode()
            watches.setCurrentWatchTime(startDelay)
        }
    }
}

export function destroy() {
    sizing.deactivate()
}

export async function main() {
    trainingInProgress = true

    if (trainingData) await trainingMode.eventCycle()
    else              await timerMode.eventCycle()

    keyUp({code: "Space"})      // Force keyUp on end, button actions are
    trainingInProgress = false                   // ignored at this point

    transitionToInitScreen()
}


// --- Private ---

// Space bar button activation

document.addEventListener("keydown", keyDown)
document.addEventListener("keyup", keyUp)

function keyDown(ev) {      // Activates button press appearance
    if (!trainingInProgress || ev.code != "Space") return

    if (getComputedStyle(buttonStart).display == "block") {
        buttonStart.classList.add("spacebar-active")
    }

    if (getComputedStyle(buttonStop).display == "block") {
        buttonStop.classList.add("spacebar-active")
    }

    if (getComputedStyle(buttonContinue).display == "block") {
        buttonContinue.classList.add("spacebar-active")
    }

    if (getComputedStyle(buttonNext).display == "block") {
        buttonNext.classList.add("spacebar-active")
    }

    if (getComputedStyle(buttonFinish).display == "block") {
        buttonFinish.classList.add("spacebar-active")
    }
}

function keyUp(ev) {
    if (!trainingInProgress || ev.code != "Space") return

    // Remove button press appearance even if button is no longer visible
    buttonStart.classList.remove("spacebar-active")
    buttonStop.classList.remove("spacebar-active")
    buttonContinue.classList.remove("spacebar-active")
    buttonNext.classList.remove("spacebar-active")
    buttonFinish.classList.remove("spacebar-active")

    // Activate button
    if (getComputedStyle(buttonStart).display == "block") buttonStart.click()
    if (getComputedStyle(buttonStop).display == "block") buttonStop.click()
    if (getComputedStyle(buttonContinue).display == "block") buttonContinue.click()
    if (getComputedStyle(buttonNext).display == "block") buttonNext.click()
    if (getComputedStyle(buttonFinish).display == "block") buttonFinish.click()
}


// Temporary

const settingsButton = document.querySelector(".ts-settings")

settingsButton.addEventListener("click", onSettingsClick)

async function onSettingsClick() {
    const ret = await settings.open()
    log("Return value: " + ret)
}