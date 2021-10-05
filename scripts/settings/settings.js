
import {waitFor} from "../tools.js"

const component = document.querySelector(".settings-component")
const mainWidnow = component.firstElementChild

const closeButton = document.querySelector(".sett-close")


// --- Public ---

export function init(trainingData) {

}

export function destroy() {

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