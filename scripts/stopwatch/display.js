
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
const buttonPause = document.querySelector(".st-pause")

const buttonReset = document.querySelector(".st-reset")
const buttonContinue = document.querySelector(".st-continue")
const buttonClose = document.querySelector(".st-close")


// --- Public ---

export const timers = {
    timerState() {
        firstHeading.textContent = secondHeading.textContent = "Timer:"
        currentStopwatch.classList.remove("running-set", "running-pause")
    },

    initialState() {
        firstHeading.textContent = "Current Time:"
        secondHeading.textContent = this._totalTrainingHeading
        currentStopwatch.classList.remove("running-set", "running-pause")
    },

    countDownState() {
        firstHeading.textContent = "Starting In:"
        secondHeading.textContent = this._totalTrainingHeading
        currentStopwatch.classList.remove("running-set", "running-pause")
    },

    setState() {
        firstHeading.textContent = "Current Set:"
        secondHeading.textContent = this._totalTrainingHeading
        currentStopwatch.classList.add("running-set")
        currentStopwatch.classList.remove("running-pause")
    },

    pauseState() {
        firstHeading.textContent = "Current Pause:"
        secondHeading.textContent = this._totalTrainingHeading
        currentStopwatch.classList.add("running-pause")
        currentStopwatch.classList.remove("running-set")
    },

    _totalTrainingHeading: "Total Time:"
}

export const buttons = {
    initialState() {
        clearButtons()
        return activateButtons(fillerLeft, buttonStart, fillerRight)[1]
    },

    timerRunningState() {
        clearButtons()
        return activateButtons(fillerLeft, buttonStop, fillerRight)[1]
    },

    trainingRunningState() {
        clearButtons()
        return activateButtons(buttonBack, buttonNext, buttonPause)
    },

    pauseState() {
        clearButtons()
        return activateButtons(buttonReset, buttonContinue, buttonClose)
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