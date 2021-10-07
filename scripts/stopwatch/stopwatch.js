
import { waitForAny, dialog } from "../tools.js"
import { transitionToInitScreen } from "../screens.js"

import * as sizing from "./sizing.js"
import * as display from "./display.js"
import { Timer } from "./timer.js"

const currentWatch = document.querySelector(".st-current-stopwatch")
const totalWatch = document.querySelector(".st-total-stopwatch")
const closeButton = document.querySelector(".ts-close")

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
    if (trainingData) await trainingMode.eventCycle()
    else              await timerMode.eventCycle()

    transitionToInitScreen()
}


// --- Private ---

const timerMode = {
    async eventCycle() {
        // Create timer
        this.timer = new Timer
        this.timer.registerCallback(addToCurrentWatch)
        this.timer.registerCallback(addToTotalWatch)

        // Cycle through events
        let mode = "initial"
        do {
            switch (mode) {
                case "initial": mode = await this._initial() ;break
                case "run":     mode = await this._run()     ;break
                case "pause":   mode = await this._pause()   ;break
            }
        } while (mode != "end")

        // Finish
        this.timer.stop()
    },

    async _initial() {
        // Setup buttons
        const startButton = display.buttons.initialMode()
        const newMode = await waitForAny(["click", startButton, "run"],
                                         ["click", closeButton, "end"])
        // Start action
        this.timer.start()
        return newMode
    },

    async _run() {
        // Setup buttons
        const stopButton = display.buttons.timerRunningMode()
        let newMode = await waitForAny(["click", stopButton, "pause"],
                                       ["click", closeButton, "end"])

        // Dialog in case of close event
        if (newMode == "end") {
            const action = await dialog("Timer is running, are you sure you \
                                        want to close it?", "Close", "Cancel")
            if (action == "Cancel") newMode = "run"
        }

        // Stop action
        if (newMode != "run") this.timer.stop()
        return newMode
    },

    async _pause() {
        // Setup buttons
        const buttons = display.buttons.pauseMode()
        const [resetButton, continueButton, closeButton] = buttons
        const newMode = await waitForAny(["click", resetButton, "initial"],
                                         ["click", continueButton, "run"],
                                         ["click", closeButton, "end"],
                                         ["click", closeButton, "end"])
        // Reset action
        if (newMode == "initial") {
            resetCurrentWatch()
            resetTotalWatch()
        }

        // Continue action
        if (newMode == "run") {
            this.timer.start()
        }
        return newMode
    }
}


const trainingMode = {
    async eventCycle() {
        // Create timer
        this.timer = new Timer
        this.timer.registerCallback(addToCurrentWatch)
        this.timer.registerCallback(addToTotalWatch)

        // Cycle through events
        let mode = "initial"
        do {
            switch (mode) {
                case "initial": mode = await this._initial() ;break
                case "run":     mode = await this._run()     ;break
                case "pause":   mode = await this._pause()   ;break
            }
        } while (mode != "end")

        // Finish
        this.timer.stop()
    },

    async _initial() {


    },

    async _run() {

    },

    async _pause() {

    }
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