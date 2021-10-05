
import {float, waitFor, dialog} from "../tools.js"

const component = document.querySelector(".settings-component")
const mainWidnow = component.firstElementChild

const closeButton = document.querySelector(".sett-close")
const trStartDelayInput = document.querySelector(".sett-tr-start-delay")
const setStartDelayInput = document.querySelector(".sett-set-start-delay")
const precedingPauseInput = document.querySelector(".sett-preceding-pause")

let trainingData = null


// --- Public ---

export function init(trData) {
    if (!trData) {
        trStartDelayInput.disabled = true
        setStartDelayInput.disabled = true
        precedingPauseInput.disabled = true
        return
    }
    trainingData = trData

    // Load values
    const settings = trData.settings
    if(!settings) return

    trStartDelayInput.value = settings.trainingStartDelay
    setStartDelayInput.value = settings.setStartDelay
    precedingPauseInput.value = settings.precedingPause
}

export function destroy() {
    trainingData = null

    trStartDelayInput.disabled = false
    setStartDelayInput.disabled = false
    precedingPauseInput.disabled = false

    trStartDelayInput.value = 0
    setStartDelayInput.value = 0
    precedingPauseInput.value = 0
}

export async function open() {
    /* return - true if settings were changed */

    // Display component
    component.classList.add("display")
    await waitFor("animationend", mainWidnow)
    mainWidnow.classList.add("enable-access")

    // Wait for close event
    do {        // Close by clicking on close button or background
        const event = await waitFor("click", component)
    } while (event.target != closeButton && event.target != component)

    // Hide component
    mainWidnow.classList.remove("enable-access")
    component.classList.add("hide")
    component.classList.remove("display")

    await waitFor("animationend", mainWidnow)
    component.classList.remove("hide")

    return false
}