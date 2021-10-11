
import {int, float, range, waitFor, dialog} from "../tools.js"

const component = document.querySelector(".settings-component")
const mainWindow = component.firstElementChild

const closeButton = document.querySelector(".sett-close")
const trCountdownSelect = document.querySelector(".sett-tr-countdown")
const setCountdownSelect = document.querySelector(".sett-set-countdown")
const precedingPauseSelect = document.querySelector(".sett-preceding-pause")

let trainingData = null


// --- Public ---

export function init(trData) {
    if (!trData) {
        trCountdownSelect.disabled = true
        setCountdownSelect.disabled = true
        precedingPauseSelect.disabled = true
        return
    }
    trainingData = trData

    // Load values
    generateSelectOptions()
    const settings = trData.settings
    if(!settings) return

    trCountdownSelect.value = settings.trainingCountdown
    setCountdownSelect.value = settings.setCountdown
    precedingPauseSelect.value = settings.precedingPause
}

export function destroy() {
    trainingData = null

    trCountdownSelect.disabled = false
    setCountdownSelect.disabled = false
    precedingPauseSelect.disabled = false

    trCountdownSelect.value = 0
    setCountdownSelect.value = 0
    precedingPauseSelect.value = 0
}

export async function open() {
    /* return - true if settings were changed */

    const oldValues = getValues()
    let changed = false

    // Display component
    component.classList.add("display")
    await waitFor("animationend", mainWindow)
    mainWindow.classList.add("enable-access")

    // Wait for close event
    let event
    do {        // Close by clicking on close button or background
        event = await waitFor("click", component)
    } while (event.target != closeButton && event.target != component)

    // Store new values
    const newValues = getValues()
    if (hasChanged(oldValues, newValues)) {
        trainingData.settings = newValues
        trainingData.store()
        changed = true
    }

    // Hide component
    mainWindow.classList.remove("enable-access")
    component.classList.add("hide")
    component.classList.remove("display")
    await waitFor("animationend", mainWindow)
    component.classList.remove("hide")

    return changed
}

export function getTrainingCountdown() {
    if (!trainingData) throw new Error("settings - no training loaded")
    if (!trainingData.settings) return 0
    return trainingData.settings.trainingCountdown
}

export function getSetCountdown() {
    if (!trainingData) throw new Error("settings - no training loaded")
    if (!trainingData.settings) return 0
    return trainingData.settings.setCountdown
}

export function getPrecedingPause() {
    if (!trainingData) throw new Error("settings - no training loaded")
    if (!trainingData.settings) return 0
    return trainingData.settings.precedingPause
}


// --- Private ---

function getValues() {
    return {
        trainingCountdown: int(trCountdownSelect.value),
        setCountdown: int(setCountdownSelect.value),
        precedingPause: int(precedingPauseSelect.value)
    }
}

function hasChanged(oldVal, newVal) {
    for (const key of Object.keys(oldVal)) {
        if (oldVal[key] != newVal[key]) return true
    }

    return false
}

function generateSelectOptions() {
    if (trCountdownSelect.children.length) return
    const fragment = document.createDocumentFragment()

    // Training Countdown
    for (const value of range(0, 301, 5)) {
        const option = document.createElement("option")
        const seconds = value % 60
        const minutes = (value - seconds) / 60

        option.value = value
        option.textContent = `${minutes}:${String(seconds).padStart(2, "0")}`

        fragment.append(option)
    }
    trCountdownSelect.append(fragment)

    // Set Countdown
    for (const value of range(61)) {
        const option = document.createElement("option")

        option.value = value
        option.textContent = String(value).padStart(2, "0") + " s"

        fragment.append(option)
    }
    setCountdownSelect.append(fragment)

    // Preceding Pause
    for (const value of range(61)) {
        const option = document.createElement("option")

        option.value = value
        option.textContent = String(value).padStart(2, "0") + " s"

        fragment.append(option)
    }
    precedingPauseSelect.append(fragment)
}