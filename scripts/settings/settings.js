
import {int, float, waitFor, dialog} from "../tools.js"

const component = document.querySelector(".settings-component")
const mainWindow = component.firstElementChild

const closeButton = document.querySelector(".sett-close")
const trCountdownInput = document.querySelector(".sett-tr-countdown")
const setStartDelayInput = document.querySelector(".sett-set-start-delay")
const precedingPauseInput = document.querySelector(".sett-preceding-pause")

let trainingData = null


// --- Public ---

export function init(trData) {
    if (!trData) {
        trCountdownInput.disabled = true
        setStartDelayInput.disabled = true
        precedingPauseInput.disabled = true
        return
    }
    trainingData = trData

    // Load values
    const settings = trData.settings
    if(!settings) return

    trCountdownInput.value = settings.trainingStartDelay
    setStartDelayInput.value = settings.setStartDelay
    precedingPauseInput.value = settings.precedingPause
}

export function destroy() {
    trainingData = null

    trCountdownInput.disabled = false
    setStartDelayInput.disabled = false
    precedingPauseInput.disabled = false

    trCountdownInput.value = 0
    setStartDelayInput.value = 0
    precedingPauseInput.value = 0
}

export async function open() {
    /* return - true if settings were changed */

    const oldValues = getValues()
    let changed = false

    // Display component
    component.classList.add("display")
    await waitFor("animationend", mainWindow)
    mainWindow.classList.add("enable-access")

    // Input validity cycle
    let cont, event
    do {
        cont = true

        // Wait for close event
        do {        // Close by clicking on close button or background
            event = await waitFor("click", component)
        } while (event.target != closeButton && event.target != component)

        // Test for invalid inputs
        if (!isValid(trCountdownInput.value) ||
            !isValid(setStartDelayInput.value) ||
            !isValid(precedingPauseInput.value)) {

            cont = false
            await dialog("You've entered invalid delay. Delay can be whole \
                         number ranging from 0 to 300 seconds.", "OK")
        }
    } while (!cont)

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
    return trainingData.settings.trainingStartDelay
}

export function getSetStartDelay() {
    if (!trainingData) throw new Error("settings - no training loaded")
    if (!trainingData.settings) return 0
    return trainingData.settings.setStartDelay
}

export function getPrecedingPause() {
    if (!trainingData) throw new Error("settings - no training loaded")
    if (!trainingData.settings) return 0
    return trainingData.settings.precedingPause
}


// --- Private ---

function isValid(value) {
    if (!value) return false

    value = float(value)
    if (!Number.isInteger(value)) return false
    if (value < 0 || value > 300) return false

    return true
}

function getValues() {
    return {
        trainingStartDelay: int(trCountdownInput.value),
        setStartDelay: int(setStartDelayInput.value),
        precedingPause: int(precedingPauseInput.value)
    }
}

function hasChanged(oldVal, newVal) {
    for (const key of Object.keys(oldVal)) {
        if (oldVal[key] != newVal[key]) return true
    }

    return false
}