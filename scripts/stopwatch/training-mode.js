
import {waitForAny, dialog} from "../tools.js"
import * as training from "../training/training.js"
import * as settings from "../settings/settings.js"

import * as display from "./display.js"
import * as watches from "./watches.js"
import {Timer} from "./timer.js"

const closeButton = document.querySelector(".ts-close")
const buttonBack = document.querySelector(".st-back")

let timer = null
let countdownTimer = null
let mode = "initial"


// --- Public ---

export async function eventCycle() {
    // Create timer
    timer = new Timer
    timer.registerCallback(watches.addToCurrentWatch)
    timer.registerCallback(watches.addToTotalWatch)

    countdownTimer = new Timer
    countdownTimer.registerCallback(countdownTick)

    training.setTimer(timer)

    // Cycle through events
    mode = "initial"
    do {
        switch (mode) {
            case "initial": mode = await initialMode() ;break
            case "run":     mode = await runMode()     ;break
            case "pause":   mode = await pauseMode()   ;break
            case "finish":  mode = await finishMode()  ;break
            case "done":    mode = await doneMode()    ;break
        }
    } while (mode != "end")

    // Finish
    timer.stop()
    countdownTimer.stop()
    buttonBack.textContent = "Back"
}

export function settingsUpdate() {
    // Update countdown
    if (mode == "initial") {
        const countdown = settings.getTrainingCountdown()
        watches.setCurrentWatchTime(countdown)

        if (countdown) display.watches.countdownMode()
        else           display.watches.initialMode()
    }
}


// --- Private ---

// --- Button modes ---

async function initialMode() {
    const startButton = display.buttons.initialMode()
    const action = await waitForAny(["click", startButton, start],
                                    ["click", closeButton, end])
    return action()
}

async function runMode() {
    const buttons = display.buttons.trainingRunMode()
    const [buttonBack, buttonNext, buttonPause] = buttons
    let action = await waitForAny(["click", buttonBack, back],
                                  ["click", buttonNext, next],
                                  ["click", buttonPause, pause],
                                  ["click", closeButton, confirmEnd("run")])
    return await action()
}

async function pauseMode() {
    const buttons = display.buttons.pauseMode()
    const [resetButton, continueButton, mainCloseButton] = buttons
    const action = await waitForAny(["click", resetButton, reset],
                                ["click", continueButton, continueAction],
                                ["click", mainCloseButton, confirmEnd("pause")],
                                ["click", closeButton, confirmEnd("pause")])
    return await action()
}

async function finishMode() {
    const buttons = display.buttons.finishMode()
    const [buttonBack, buttonFinish, buttonPause] = buttons
    let action = await waitForAny(["click", buttonBack, back],
                                  ["click", buttonFinish, finish],
                                  ["click", buttonPause, pause],
                                  ["click", closeButton, confirmEnd("finish")])
    return await action()
}

async function doneMode() {
    const [buttonReset, buttonClose] = display.buttons.doneMode()
    let action = await waitForAny(["click", buttonReset, reset],
                                   ["click", buttonClose, end],
                                   ["click", closeButton, end])
    return action()
}


// --- Button actions ---

// Initial

function start() {
    // Start countdown mode if set
    if (display.watches.mode == "countdown") {
        countdownTimer.start()
        buttonBack.textContent = "+ 30 s"

    // Start first set
    } else {
        display.watches.setMode()
        timer.start()
    }

    return "run"
}

function countdownTick() {
    watches.substractFromCurrentWatch()

    // Start set when countdown reaches 0
    if (!watches.getCurrentWatchTime()) {
        display.watches.setMode()
        countdownTimer.stop()
        timer.start()

        buttonBack.textContent = "Back"
    }
}


// Run

function back() {
    // Adds aditional 30s in countdown mode
    if (display.watches.mode == "countdown") {
        watches.setCurrentWatchTime(watches.getCurrentWatchTime() + 30)
        return "run"
    }

    const {phase: newPhase, time: newTime} = training.back()
    if (!newPhase) return "run"

    if (newPhase == "set") display.watches.setMode()
    else                   display.watches.pauseMode()

    watches.setCurrentWatchTime(newTime)
    return "run"
}

function next() {
    let newPhase

    if (display.watches.mode == "countdown") {
        countdownTimer.stop()
        timer.start()

        newPhase = "set"
        buttonBack.textContent = "Back"
    } else {
        newPhase = training.next()
    }

    if (newPhase == "set") display.watches.setMode()
    else                   display.watches.pauseMode()

    watches.resetCurrentWatchTime()
    return !training.isLast() ? "run" : "finish"
}

function pause() {
    if (display.watches.mode == "countdown") {
        countdownTimer.stop()
    } else {
        timer.stop()
    }

    return "pause"
}


// Pause

function reset() {
    watches.resetCurrentWatchTime()
    watches.resetTotalWatchTime()
    display.watches.initialMode()
    training.reset()

    // Countdown mode
    const countdown = settings.getTrainingCountdown()
    if (countdown) {
        display.watches.countdownMode()
        watches.setCurrentWatchTime(countdown)
    }

    return "initial"
}

function continueAction() {
    if (display.watches.mode == "countdown") countdownTimer.start()
    else                                     timer.start()

    return !training.isLast() ? "run" : "finish"
}


// Finish

function finish() {
    timer.stop()
    return "done"
}


// Quit actions

function end() { return "end" }

function confirmEnd(sameMode) {
    return async () => {
        const action = await dialog("Are you sure you want to close this \
                                     training?", "Close", "Cancel")
        if (action == "Cancel") return sameMode
        return "end"
    }
}