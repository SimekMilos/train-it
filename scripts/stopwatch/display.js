
const firstHeading = document.querySelector(".st-first-container h2")
const secondHeading = document.querySelector(".st-second-container h2")
const currentStopwatch = document.querySelector(".st-current-stopwatch")

const mainCtrContainer = document.querySelector(".st-main-controls")
const fillerLeft = document.querySelector(".st-filler-left")
const fillerRight = document.querySelector(".st-filler-right")

const buttonStart = document.querySelector(".st-start")
const buttonStop = document.querySelector(".st-stop")

const buttonBack = document.querySelector(".st-back")
const buttonNext = document.querySelector(".st-next")
const buttonFinish = document.querySelector(".st-finish")
const buttonPause = document.querySelector(".st-pause")

const buttonReset = document.querySelector(".st-reset")
const buttonContinue = document.querySelector(".st-continue")
const buttonClose = document.querySelector(".st-close")


// --- Public ---

export const watches = {
    get mode() { return this._mode },

    timerMode() {
        firstHeading.textContent = secondHeading.textContent = "Timer:"
        currentStopwatch.classList.remove("running-set", "running-pause")
        this._mode = "timer"
    },

    initialMode() {
        firstHeading.textContent = "Current Time:"
        secondHeading.textContent = this._totalTrainingHeading
        currentStopwatch.classList.remove("running-set", "running-pause")
        this._mode = "initial"
    },

    countdownMode() {
        firstHeading.textContent = "Countdown:"
        secondHeading.textContent = this._totalTrainingHeading
        currentStopwatch.classList.remove("running-set", "running-pause")
        this._mode = "countdown"
    },

    setMode() {
        firstHeading.textContent = "Current Set:"
        secondHeading.textContent = this._totalTrainingHeading
        currentStopwatch.classList.add("running-set")
        currentStopwatch.classList.remove("running-pause")
        this._mode = "set"
    },

    pauseMode() {
        firstHeading.textContent = "Current Pause:"
        secondHeading.textContent = this._totalTrainingHeading
        currentStopwatch.classList.add("running-pause")
        currentStopwatch.classList.remove("running-set")
        this._mode = "pause"
    },

    _mode: null,
    _totalTrainingHeading: "Total Time:"
}

export const buttons = {
    initialMode() {
        clearButtons()
        return activateButtons(fillerLeft, buttonStart, fillerRight)[1]
    },

    timerRunMode() {
        clearButtons()
        return activateButtons(fillerLeft, buttonStop, fillerRight)[1]
    },

    trainingRunMode() {
        clearButtons()
        return activateButtons(buttonBack, buttonNext, buttonPause)
    },

    pauseMode() {
        clearButtons()
        return activateButtons(buttonReset, buttonContinue, buttonClose)
    },

    finishMode() {
        clearButtons()
        return activateButtons(buttonBack, buttonFinish, buttonPause)
    },

    doneMode() {
        clearButtons()
        return activateButtons(buttonReset, buttonClose)
    }
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