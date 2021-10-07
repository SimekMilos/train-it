
import { waitForAny, dialog } from "../tools.js"
import { transitionToInitScreen } from "../screens.js"

import * as sizing from "./sizing.js"
import * as display from "./display.js"

const closeButton = document.querySelector(".ts-close")
const closeEvent = ["click", closeButton, "end"]

let trainingData = null


// --- Public ---

export function init(trData) {
    /* trData: null - starts timer, obj - starts training */

    sizing.activate()
    display.buttons.initialState()
    trainingData = trData

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


// Temporary
import * as settings from "../settings/settings.js"

const settingsButton = document.querySelector(".ts-settings")

settingsButton.addEventListener("click", onSettingsClick)

async function onSettingsClick() {
    const ret = await settings.open()
    log("Return value: " + ret)
}