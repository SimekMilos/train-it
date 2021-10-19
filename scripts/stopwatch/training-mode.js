
import {wait, waitForAny, dialog} from "../tools.js"
import * as training from "../training/training.js"
import * as settings from "../settings/settings.js"

import * as display from "./display.js"
import * as watches from "./watches.js"
// import * as nosleep from "./nosleep.js"
import {Timer} from "./timer.js"
import {deactSpacebarContext} from "./spacebar.js"

const closeButton = document.querySelector(".ts-close")
const buttonBack = document.querySelector(".st-back")

let timer = null
let countdownTimer = null
let delayCountdownTick = null
let mode = "initial"


// --- Public ---

export function init() {
    const countdown = settings.getTrainingCountdown()

    if (countdown) {
        display.watches.countdownMode()
        watches.setCurrentWatchTime(countdown)
        return
    }

    display.watches.initialMode()
}

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

        // Activate app close warning during active training
        if ((new Set(["run", "pause", "finish"])).has(mode)) {
            window.addEventListener("beforeunload", closeWarning)
        } else {
            window.removeEventListener("beforeunload", closeWarning)
        }

        // Prevent device sleep during running training
        // if ((new Set(["run", "finish"])).has(mode)) nosleep.activate()
        // else nosleep.deactivate()

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
                                  ["click", closeButton, confirmEnd])
    return await deactSpacebarContext(action)
}

async function pauseMode() {
    const buttons = display.buttons.pauseMode()
    const [resetButton, continueButton, mainCloseButton] = buttons
    const action = await waitForAny(["click", resetButton, reset],
                                    ["click", continueButton, continueAction],
                                    ["click", mainCloseButton, confirmEnd],
                                    ["click", closeButton, confirmEnd])
    return await deactSpacebarContext(action)
}

async function finishMode() {
    const buttons = display.buttons.finishMode()
    const [buttonBack, buttonFinish, buttonPause] = buttons
    let action = await waitForAny(["click", buttonBack, back],
                                  ["click", buttonFinish, finish],
                                  ["click", buttonPause, pause],
                                  ["click", closeButton, confirmEnd])
    return await deactSpacebarContext(action)
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
        buttonBack.textContent = "+ 15 s"

    // Start first set
    } else {
        display.watches.setMode()
        training.start()
        timer.start()
    }

    return "run"
}

async function countdownTick() {
    await delayCountdownTick
    watches.substractFromCurrentWatch()

    // Start set when countdown reaches 0
    if (!watches.getCurrentWatchTime()) {
        display.watches.setMode()
        countdownTimer.stop()
        training.start()
        timer.start()

        buttonBack.textContent = "Back"
    }
}


// Run

async function back() {
    // Synchronizes action with timer tick and delays countdown tick after
    let resolve
    delayCountdownTick = new Promise(res => resolve = res)
    await waitForTick()
    resolve()

    // Adds aditional 15s in countdown mode
    if (display.watches.mode == "countdown") {
        watches.setCurrentWatchTime(watches.getCurrentWatchTime() + 15)
        return "run"
    }

    // Resets curent phase if above 3s
    if (watches.getCurrentWatchTime() > 3) {
        watches.resetCurrentWatchTime()
        training.resetPhase()
        return mode
    }

    // Go phase back if 3s or less
    const newPhase = training.back()

    if (newPhase == "set")   display.watches.setMode()
    if (newPhase == "pause") display.watches.pauseMode()
    //  newPhase == null ->  ignore

    watches.setCurrentWatchTime(training.getCurrentTime())
    return "run"
}

async function next() {
    // Prevent simultaneous actions: next & countdown start set
    if (display.watches.mode == "countdown" &&
        watches.getCurrentWatchTime() == 1) return "run"

    let precedeTime = 0, newPhase
    await waitForTick()

    // Display set countdown
    if (display.watches.mode == "pause" && settings.getSetCountdown()) {
        await setCoutdown()
    }

    // Preceding pause
    if (display.watches.mode == "set") {
        precedeTime = Math.min(settings.getPrecedingPause(),
                               watches.getCurrentWatchTime())
        training.substractTime(precedeTime)
    }

    // Countdown mode
    if (display.watches.mode == "countdown") {
        countdownTimer.stop()
        training.start()
        timer.start()

        newPhase = "set"
        buttonBack.textContent = "Back"

    // Standard mode
    } else {
        newPhase = training.next()
    }

    // Change appearance
    if (newPhase == "set") display.watches.setMode()
    else                   display.watches.pauseMode()

    training.addTime(precedeTime)
    watches.setCurrentWatchTime(precedeTime)
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

async function reset() {
    // Confirm in pause mode
    if (mode == "pause") {
        const action = await dialog("Are you sure you want to reset this \
                                     training?", "Reset", "Cancel")
        if (action == "Cancel") return "pause"
    }

    // Reset
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

async function confirmEnd() {
    const action = await dialog("Are you sure you want to close this training?",
                                "Close", "Cancel")
    if (action == "Cancel") return mode
    return "end"
}


// --- Other ---

async function waitForTick() {
    let resolve
    const promise = new Promise(res => resolve = res)
    const waiter = () => resolve()

    timer.registerCallback(waiter)
    countdownTimer.registerCallback(waiter)

    await promise
    timer.removeCallback(waiter)
    countdownTimer.removeCallback(waiter)
}

function closeWarning(ev) {
    ev.preventDefault()
    ev.returnValue = ""
    return ""
}

async function setCoutdown() {
    let finish = false

    // Create subcomponent
    const component = document.createElement("div")
    component.classList.add("set-countdown")

    const mainDisplay = document.createElement("div")
    mainDisplay.classList.add("main")
    component.append(mainDisplay)

    const counter = document.createElement("p")
    counter.classList.add("counter")
    mainDisplay.append(counter)

    const startNowButton = document.createElement("button")
    startNowButton.classList.add("control-button")
    mainDisplay.append(startNowButton)

    const fontCentering = document.createElement("div")
    fontCentering.classList.add("center-font")
    fontCentering.textContent = "Start Now"
    startNowButton.append(fontCentering)

    // Register button events
    function keyDown(ev) {
        if (ev.code != "Space") return
        startNowButton.classList.add("spacebar-active")
    }

    function keyUp(ev) {
        if (ev.code != "Space") return
        startNowButton.classList.remove("spacebar-active")
        startNowButton.click()
    }

    async function onClick() {
        await wait(200)
        finish = true
    }

    document.addEventListener("keydown", keyDown)
    document.addEventListener("keyup", keyUp)
    startNowButton.addEventListener("click", onClick)

    // Display
    let countdownTime = settings.getSetCountdown()
    counter.textContent = countdownTime
    document.body.append(component)

    // Countdown
    let resolve
    const promise = new Promise(res => resolve = res)

    function count() {
        countdownTime--
        counter.textContent = countdownTime
        if (!countdownTime || finish) resolve()
    }
    timer.registerCallback(count)

    // Finish
    await promise
    component.remove()
    timer.removeCallback(count)
    document.removeEventListener("keydown", keyDown)
    document.removeEventListener("keyup", keyUp)
}