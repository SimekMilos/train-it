
import { transitionToInitScreen } from "../screens.js"

import * as sizing from "./sizing.js"
import * as display from "./display.js"
import * as watches from "./watches.js"
import * as trainingMode from "./training-mode.js"
import * as timerMode from "./timer-mode.js"

let trainingData = null


// --- Public ---

export function init(trData) {
    /* trData: null - starts timer, obj - starts training */

    sizing.activate()
    display.buttons.initialMode()
    trainingData = trData

    watches.resetCurrentWatch()
    watches.resetTotalWatch()

    if (!trData) display.timers.timerMode()
    else display.timers.initialMode()
}

export function destroy() {
    sizing.deactivate()
}

export async function main() {
    if (trainingData) await trainingMode.eventCycle()
    else              await timerMode.eventCycle()

    transitionToInitScreen()
}


// --- Private ---

// Temporary
import * as settings from "../settings/settings.js"

const settingsButton = document.querySelector(".ts-settings")

settingsButton.addEventListener("click", onSettingsClick)

async function onSettingsClick() {
    const ret = await settings.open()
    log("Return value: " + ret)
}