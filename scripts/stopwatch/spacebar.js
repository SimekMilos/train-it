
/* Spacebar button activation functionality */

import {asyncContextManager} from "../tools.js"

const buttonStart = document.querySelector(".st-start")
const buttonStop = document.querySelector(".st-stop")
const buttonContinue = document.querySelector(".st-continue")
const buttonNext = document.querySelector(".st-next")
const buttonFinish = document.querySelector(".st-finish")


// --- Interface ---

export function activate() {
    document.addEventListener("keydown", keyDown)
    document.addEventListener("keyup", keyUp)
}

export function deactivate() {
    document.removeEventListener("keydown", keyDown)
    document.removeEventListener("keyup", keyUp)
    removePressAppearance()
}

export const deactSpacebarContext = asyncContextManager(deactivate, activate)


// --- Private ---

function keyDown(ev) {      // Activates button press appearance
    if (ev.code != "Space") return

    if (getComputedStyle(buttonStart).display == "block") {
        buttonStart.classList.add("spacebar-active")
    }

    if (getComputedStyle(buttonStop).display == "block") {
        buttonStop.classList.add("spacebar-active")
    }

    if (getComputedStyle(buttonContinue).display == "block") {
        buttonContinue.classList.add("spacebar-active")
    }

    if (getComputedStyle(buttonNext).display == "block") {
        buttonNext.classList.add("spacebar-active")
    }

    if (getComputedStyle(buttonFinish).display == "block") {
        buttonFinish.classList.add("spacebar-active")
    }
}

function keyUp(ev) {
    if (ev.code != "Space") return

    removePressAppearance()

    // Activate button
    if (getComputedStyle(buttonStart).display == "block") buttonStart.click()
    if (getComputedStyle(buttonStop).display == "block") buttonStop.click()
    if (getComputedStyle(buttonContinue).display == "block") buttonContinue.click()
    if (getComputedStyle(buttonNext).display == "block") buttonNext.click()
    if (getComputedStyle(buttonFinish).display == "block") buttonFinish.click()
}

function removePressAppearance() {
    buttonStart.classList.remove("spacebar-active")
    buttonStop.classList.remove("spacebar-active")
    buttonContinue.classList.remove("spacebar-active")
    buttonNext.classList.remove("spacebar-active")
    buttonFinish.classList.remove("spacebar-active")
}