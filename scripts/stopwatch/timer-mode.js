
import {waitForAny, dialog} from "../tools.js"

import * as watches from "./watches.js"
import * as display from "./display.js"
import * as wakeLock from "../wake-lock.js"
import {Timer} from "./timer.js"

const closeButton = document.querySelector(".ts-close")

let timer = null


// --- Public ---

export function init() {
    display.watches.timerMode()
}

export async function eventCycle() {
    // Create timer
    timer = new Timer
    timer.registerCallback(watches.addToCurrentWatch)
    timer.registerCallback(watches.addToTotalWatch)

    // Cycle through events
    let mode = "initial"
    do {
        switch (mode) {
            case "initial": mode = await initialMode() ;break
            case "run":     mode = await runMode()     ;break
            case "pause":   mode = await pauseMode()   ;break
        }

        // Activate app close warning and prevent sleep in run mode
        if (mode == "run") {
            wakeLock.activate()
            window.addEventListener("beforeunload", closeWarning)
        }
        else {
            wakeLock.deactivate()
            window.removeEventListener("beforeunload", closeWarning)
        }

    } while (mode != "end")

    // Finish
    timer.stop()
}


// --- Private ---

// Button modes

async function initialMode() {
    // Setup buttons
    const startButton = display.buttons.initialMode()
    const newMode = await waitForAny(["click", startButton, "run"],
                                     ["click", closeButton, "end"])
    // Start action
    timer.start()
    return newMode
}

async function runMode() {
    // Setup buttons
    const stopButton = display.buttons.timerRunMode()
    let newMode = await waitForAny(["click", stopButton, "pause"],
                                   ["click", closeButton, "end"])

    // Close action
    if (newMode == "end") {
        const action = await dialog("Timer is running, are you sure you want to close it?",
                                    ["Close", "Cancel"], "dialog-first-button-red")
        if (action == "Cancel") newMode = "run"
    }

    // Stop action
    if (newMode != "run") timer.stop()
    return newMode
}

async function pauseMode() {
    // Setup buttons
    const buttons = display.buttons.pauseMode()
    const [resetButton, continueButton, mainCloseButton] = buttons
    const newMode = await waitForAny(["click", resetButton, "initial"],
                                     ["click", continueButton, "run"],
                                     ["click", mainCloseButton, "end"],
                                     ["click", closeButton, "end"])
    // Reset action
    if (newMode == "initial") {
        watches.resetCurrentWatchTime()
        watches.resetTotalWatchTime()
    }

    // Continue action
    if (newMode == "run") timer.start()
    return newMode
}


// Close warning

function closeWarning(ev) {
    ev.preventDefault()
    ev.returnValue = ""
    return ""
}