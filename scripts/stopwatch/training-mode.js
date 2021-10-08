
import {waitForAny, dialog} from "../tools.js"
import * as training from "../training/training.js"

import * as display from "./display.js"
import * as watches from "./watches.js"
import {Timer} from "./timer.js"

const closeButton = document.querySelector(".ts-close")
const buttonNext = document.querySelector(".st-next")

let timer = null


// --- Public ---

export async function eventCycle() {
    // Create timer
    timer = new Timer
    timer.registerCallback(watches.addToCurrentWatch)
    timer.registerCallback(watches.addToTotalWatch)
    training.setTimer(timer)

    document.addEventListener("keydown", keyDown)
    document.addEventListener("keyup", keyUp)

    // Cycle through events
    let mode = "initial"
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
    document.removeEventListener("keydown", keyDown)
    document.removeEventListener("keyup", keyUp)
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
    let newMode = await waitForAny(["click", buttonReset, "initial"],
                                   ["click", buttonClose, "end"],
                                   ["click", closeButton, "end"])
    return newMode
}


// Spacebar "Next" functionality
function keyDown(ev) {
    if (ev.code != "Space") return
    if (getComputedStyle(buttonNext).display == "none") return

    buttonNext.classList.add("spacebar-active")
}

function keyUp(ev) {
    if (ev.code != "Space") return
    buttonNext.classList.remove("spacebar-active")

    if (getComputedStyle(buttonNext).display == "none") return
    buttonNext.click()
}


// --- Button actions ---

// Initial

function start() {
    display.watches.setMode()
    timer.start()

    return "run"
}


// Run

function back() {
    const {phase: newPhase, time: newTime} = training.back()
    if (!newPhase) return "run"

    if (newPhase == "set") display.watches.setMode()
    else                   display.watches.pauseMode()

    watches.setCurrentWatchTime(newTime)
    return "run"
}

function next() {
    const newPhase = training.next()

    if (newPhase == "set") display.watches.setMode()
    else                   display.watches.pauseMode()

    watches.resetCurrentWatchTime()
    return training.isLast() ? "finish" : "run"
}

function pause() {
    timer.stop()
    return "pause"
}


// Pause

function reset() {
    watches.resetCurrentWatchTime()
    watches.resetTotalWatchTime()
    display.watches.initialMode()
    training.reset()

    return "initial"
}

function continueAction() {
    timer.start()
    return training.isLast() ? "finish" : "run"
}


// Finish

function finish() {
    timer.stop()
    return "done"
}


// Done

// function reset() {

// }

// function close() {

// }


// Quit actions

function end() {
    return "end"
}

function confirmEnd(sameMode) {
    return async () => {
        const action = await dialog("Training is running, are you sure you \
                                     want to close it?", "Close", "Cancel")
        if (action == "Cancel") return sameMode
        return "end"
    }
}