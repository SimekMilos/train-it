
import { waitForAny, dialog } from "../tools.js"
import { transitionToInitScreen } from "../screens.js"

import * as sizing from "./sizing.js"
import * as display from "./display.js"

const currentWatch = document.querySelector(".st-current-stopwatch")
const totalWatch = document.querySelector(".st-total-stopwatch")

const closeButton = document.querySelector(".ts-close")
const closeEvent = ["click", closeButton, "end"]

let trainingData = null
let currentWatchTime = 0
let totalWatchTime = 0


// --- Public ---

export function init(trData) {
    /* trData: null - starts timer, obj - starts training */

    sizing.activate()
    display.buttons.initialState()
    trainingData = trData

    resetCurrentWatch()
    resetTotalWatch()

    if (!trData) display.timers.timerState()
    else display.timers.initialState()
}

export function destroy() {
    sizing.deactivate()
}

export async function main() {
    let state = "initial"

    // Timer mode
    if (!trainingData) {
        do {
            switch (state) {
                case "initial":
                    const start = display.buttons.initialState()
                    state = await waitForAny(["click", start, "run"],
                                             closeEvent)
                    break;

                case "run":
                    const stop = display.buttons.timerRunningState()
                    state = await waitForAny(["click", stop, "pause"],
                                             closeEvent)

                    if (state == "end") {
                        const action = await dialog("Timer is running, are you\
                                                    sure you want to close it?",
                                                    "Close", "Cancel")
                        if (action == "Cancel") state = "run"
                    }
                    break;

                case "pause":
                    const buttons = display.buttons.pauseState()
                    const [reset, continueButt, close] = buttons

                    state = await waitForAny(["click", reset, "initial"],
                                             ["click", continueButt, "run"],
                                             ["click", close, "end"],
                                             closeEvent)
                    break;
            }
        } while(state != "end")

    // Training mode
    } else {

    }

    transitionToInitScreen()
}


function resetCurrentWatch() {
    currentWatchTime = 0
    currentWatch.textContent = "00:00"
}

function resetTotalWatch() {
    totalWatchTime = 0
    totalWatch.textContent = "00:00:00"
}


// Temporary
import * as settings from "../settings/settings.js"

const settingsButton = document.querySelector(".ts-settings")

settingsButton.addEventListener("click", onSettingsClick)

async function onSettingsClick() {
    const ret = await settings.open()
    log("Return value: " + ret)
}