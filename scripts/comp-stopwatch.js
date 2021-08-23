
import {float, px} from "./tools.js"

const mainScreen = document.querySelector(".main-screen")

const firstContainer = document.querySelector(".st-first-container")
const secondContainer = document.querySelector(".st-second-container")

const currentStopwatch = document.querySelector(".st-current-stopwatch")
const totalStopwatch = document.querySelector(".st-total-stopwatch")


// temporary - activate when first displaying stopwatch
//           - deactivate when stopwatch is hidden

function onAppLoad() {
    setStopwatchSize()
    window.addEventListener("resize", setStopwatchSize)
}

window.addEventListener("load", onAppLoad)


function setStopwatchSize() {
    // get max width
    const mainStyles = getComputedStyle(mainScreen)
    const padding = float(mainStyles.paddingLeft) + float(mainStyles.paddingRight)

    const contStyles = [getComputedStyle(firstContainer),
                    getComputedStyle(secondContainer)]
    const margin = float(contStyles[0].marginLeft) + float(contStyles[0].marginRight) +
                   float(contStyles[1].marginLeft) + float(contStyles[1].marginRight)

    let maxWidth = (innerWidth / 2) - padding - margin

    // get max height
    const position = currentStopwatch.getBoundingClientRect().y
    let maxHeight = (innerHeight * .4) - position

    // portrait mode
    if (matchMedia("(orientation:portrait)").matches) {
        maxWidth = innerWidth - padding - margin
        maxHeight /= 2
    }

    // compute maximum size
    const watchStyles = getComputedStyle(currentStopwatch)
    const maxSize = Math.min(maxHeight, maxWidth / 3.2) / .8 // line height factor

    // assing size to watches
    currentStopwatch.style.fontSize = px(maxSize)
    totalStopwatch.style.fontSize = px(maxSize * 3.2/4.95)  // ratio of watch widths
}