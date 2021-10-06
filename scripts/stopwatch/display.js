
const mainCtrContainer = document.querySelector(".st-main-controls")

const fillerLeft = document.querySelector(".st-filler-left")
const fillerRight = document.querySelector(".st-filler-right")

const buttonStart = document.querySelector(".st-start")
const buttonStop = document.querySelector(".st-stop")

const buttonBack = document.querySelector(".st-back")
const buttonNext = document.querySelector(".st-next")
const buttonPause = document.querySelector(".st-pause")

const buttonReset = document.querySelector(".st-reset")
const buttonContinue = document.querySelector(".st-continue")
const buttonClose = document.querySelector(".st-close")


// --- Public ---

buttonInitState()    // Temporary

export function buttonInitState() {
    clearButtons()
    activateButtons(fillerLeft, buttonStart, fillerRight)
    return buttonStart
}

export function buttonTimerState() {
    clearButtons()
    activateButtons(fillerLeft, buttonStop, fillerRight)
    return buttonStop
}

export function buttonTrainingState() {
    clearButtons()
    return activateButtons(buttonBack, buttonNext, buttonPause)
}

export function buttonPauseState() {
    clearButtons()
    return activateButtons(buttonReset, buttonContinue, buttonClose)
}


// --- Private ---

function clearButtons() {
    for (const button of mainCtrContainer.children) {
        button.style.display = "none"
    }
}

function activateButtons(...buttons) {
    for (const button of buttons) {
        button.style.display = "block"
    }

    return buttons
}