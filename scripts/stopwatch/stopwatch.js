
import { waitForAny, dialog } from "../tools.js"
import { transitionToInitScreen } from "../screens.js"

import * as sizing from "./sizing.js"
import * as display from "./display.js"
import { Timer } from "./timer.js"

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
    display.buttons.initialMode()
    trainingData = trData

    resetCurrentWatch()
    resetTotalWatch()

    if (!trData) display.timers.timerMode()
    else display.timers.initialMode()
}

export function destroy() {
    sizing.deactivate()
}

export async function main() {
    let state = "initial"

    const timer = new Timer
    timer.registerCallback(addToCurrentWatch)
    timer.registerCallback(addToTotalWatch)

    // Timer mode
    if (!trainingData) {
        do {
            switch (state) {
                case "initial":
                    const start = display.buttons.initialState()
                    state = await waitForAny(["click", start, "run"],
                                             closeEvent)
                    timer.start()
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
                    if (state != "run") timer.stop()
                    break;

                case "pause":
                    const buttons = display.buttons.pauseState()
                    const [reset, continueButt, close] = buttons

                    state = await waitForAny(["click", reset, "initial"],
                                             ["click", continueButt, "run"],
                                             ["click", close, "end"],
                                             closeEvent)
                    if (state == "initial") {
                        resetCurrentWatch()
                        resetTotalWatch()
                    }
                    if (state == "run") timer.start()
                    break;
            }
        } while(state != "end")

    // Training mode
    } else {

    }

    timer.stop()
    transitionToInitScreen()
}

function addToCurrentWatch() {
    currentWatchTime++

    let seconds = currentWatchTime % 60
    let minutes = ((currentWatchTime - seconds) / 60) % 60
    seconds = String(seconds).padStart(2, "0")
    minutes = String(minutes).padStart(2, "0")

    currentWatch.textContent = `${minutes}:${seconds}`
}

function addToTotalWatch() {
    totalWatchTime++

    let seconds = currentWatchTime % 60
    let minutes = ((currentWatchTime - seconds) / 60) % 60
    let hours = ((totalWatchTime - minutes*60 - seconds) / 3600 ) % 24
    seconds = String(seconds).padStart(2, "0")
    minutes = String(minutes).padStart(2, "0")
    hours = String(hours).padStart(2, "0")

    totalWatch.textContent = `${hours}:${minutes}:${seconds}`
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