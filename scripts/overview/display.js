
import {waitFor} from "../tools.js"

const overviewComponent = document.querySelector(".overview-component")
const settingsButton = document.querySelector(".ov-settings")

const compClassList = overviewComponent.classList
const compStyle = overviewComponent.style


// Display

export async function display() {
    compClassList.add("display")

    await waitFor("animationend", overviewComponent)
    compClassList.add("enable-access")
}

export async function hide() {
    compClassList.add("hide")
    compClassList.remove("display", "enable-access")

    await waitFor("animationend", overviewComponent)
    compClassList.remove("hide")
}


// Disabling

export async function disable(animDuration = 0) {
    /* animDuration - time in ms */

    compStyle.setProperty("--disable-anim-duration", `${animDuration / 1000}s`)
    compClassList.add("disable-visible-display")

    await waitFor("animationend", overviewComponent)
}

export async function enable(animDuration = 0) {
    /* animDuration - time in ms */

    compStyle.setProperty("--disable-anim-duration", `${animDuration / 1000}s`)
    compClassList.add("disable-visible-hide")
    compClassList.remove("disable-visible-display")

    await waitFor("animationend", overviewComponent)
    compClassList.remove("disable-visible-hide")
}

export function isDisabled() {
    return compClassList.contains("disable-visible-display")
}


// Settings button

export function settingsButtonDisable(disable) {
    settingsButton.disabled = disable
}