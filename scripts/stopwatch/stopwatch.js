
import {transitionToInitScreen} from "../screens.js"
import * as settings from "../settings/settings.js"

import * as sizing from "./sizing.js"
import * as display from "./display.js"
import * as watches from "./watches.js"
import * as trainingMode from "./training-mode.js"
import * as timerMode from "./timer-mode.js"
import * as spacebar from "./spacebar.js"

const settingsButton = document.querySelector(".ts-settings")

let trainingData = null


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
        const countdown = settings.getTrainingCountdown()

        if (!countdown) display.watches.initialMode()
        else {
            display.watches.countdownMode()
            watches.setCurrentWatchTime(countdown)
        }
    }
}

export function destroy() {
    sizing.deactivate()
}

export async function main() {
    spacebar.activate()

    if (trainingData) await trainingMode.eventCycle()
    else              await timerMode.eventCycle()

    spacebar.deactivate()
    transitionToInitScreen()
}


// --- Private ---

settingsButton.addEventListener("click", onSettingsClick)

async function onSettingsClick() {
    const changed = await settings.open()           // Can't be changed in
    if (changed) trainingMode.settingsUpdate()      // timer mode
}