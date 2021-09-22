
import {float, waitFor} from "../tools.js"
import * as overview from "../overview/overview.js"

const initialScreen = document.querySelector(".initial-screen")
const container = document.querySelector(".ts-container")
const component = container.firstElementChild

const containerStyles = window.getComputedStyle(container)


export async function display() {
    component.classList.add("display")
    component.style.width = getComponentWidth()
    container.classList.add("display")

    // Alternative display
    if(containerStyles.position !== "absolute") {
        container.classList.add("animate")
    } else {
        overview.disableShadow()
    }

    overview.disable(700)

    await waitFor("animationend", component)
    component.classList.add("enable-access")
    component.style.removeProperty("width")
}



function getComponentWidth() {
    let width = initialScreen.clientWidth
    const screenStyles = window.getComputedStyle(initialScreen)

    width -= float(screenStyles.paddingLeft)
    width -= float(screenStyles.paddingRight)

    if (containerStyles.position !== "absolute") {
        width -= 3*20 - 5   // Margins
        width /= 2          // width is split between 2 components
    } else {
        width -= 2*20       // Only margins for narrow viewport
    }

    return width > 400 ? "400px" : px(width)
}