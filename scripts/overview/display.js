
import {waitFor} from "../tools.js"

const component = document.querySelector(".overview-component")
const settingsButton = document.querySelector(".ov-settings")

const compClassList = component.classList
const compStyle = component.style

let shadowDisplayed = true


// Display

export async function display() {
    compClassList.add("display")

    await waitFor("animationend", component)
    enableAccess()
}

export async function hide() {
    compClassList.add("hide")
    compClassList.remove("display")
    disableAccess()

    await waitFor("animationend", component)
    compClassList.remove("hide")
}


// Visible component disabling

export async function disable(animDuration = 0) {
    /* animDuration - time in ms */

    compStyle.setProperty("--disable-anim-duration", `${animDuration}ms`)
    compClassList.add("disable-visible-display")

    await waitFor("animationend", component)
}

export async function enable(animDuration = 0) {
    /* animDuration - time in ms */

    compStyle.setProperty("--disable-anim-duration", `${animDuration}ms`)
    compClassList.add("disable-visible-hide")
    compClassList.remove("disable-visible-display")

    await waitFor("animationend", component)
    compClassList.remove("disable-visible-hide")
}

export function isDisabled() {
    return compClassList.contains("disable-visible-display")
}


// Access disabling

export function disableAccess() {
    compClassList.remove("enable-access")
}

export function enableAccess() {
    compClassList.add("enable-access")
}


// Shadow disabling

export function hideShadow() {
    component.style.boxShadow = "none"
    shadowDisplayed = false
}

export function displayShadow() {
    component.style.removeProperty("box-shadow")
    shadowDisplayed = true
}

export function shadowIsDisplayed() {
    return shadowDisplayed
}


// Settings button

export function settingsButtonDisabling(disable) {
    settingsButton.disabled = disable
}