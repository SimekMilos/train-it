
import {float, px} from "./tools.js"

const stopwatchComp = document.querySelector(".stopwatch-component")

const headings = document.querySelectorAll(".stopwatch-component h2")

const firstContainer = document.querySelector(".st-first-container")
const secondContainer = document.querySelector(".st-second-container")

const currentStopwatch = document.querySelector(".st-current-stopwatch")
const totalStopwatch = document.querySelector(".st-total-stopwatch")

const headingHeightFactor = 0.2

// temporary - activate when first displaying stopwatch
//           - deactivate when stopwatch is hidden

function onAppLoad() {
    onResize()
    window.addEventListener("resize", onResize)
}

window.addEventListener("load", onAppLoad)

function onResize() {
    setComponentHeight()
    setHeadingHeight()
    setStopwatchSize()
}

function setComponentHeight() {
    let height = innerHeight * .4   // size shoud be 2/5 of viewport

    // compute paddings and margins
    const compStyles = getComputedStyle(stopwatchComp)
    const padding = float(compStyles.paddingLeft) + float(compStyles.paddingRight)

    const contStyles = [getComputedStyle(firstContainer),
                    getComputedStyle(secondContainer)]
    const margin = float(contStyles[0].marginLeft) + float(contStyles[0].marginRight) +
                   float(contStyles[1].marginLeft) + float(contStyles[1].marginRight)

    // compute max height
    const maxWatchWidth = (innerWidth - padding - margin) / 2
    const maxWatchHeight = maxWatchWidth / 3.2  // width to height font ratio
    const maxHeight = (maxWatchHeight + float(compStyles.paddingBottom))
                       / (1 - headingHeightFactor)

    if (height > maxHeight) height = maxHeight
    stopwatchComp.style.height = px(height)
}

function setHeadingHeight() {
    const compHeight = float(getComputedStyle(stopwatchComp).height)
    const headingHeight = compHeight * headingHeightFactor

    for (const heading of headings) {
        heading.style.height = px(headingHeight)
        heading.style.fontSize = px(.5 * headingHeight)
    }
}

function setStopwatchSize() {
    // get max width
    const compStyles = getComputedStyle(stopwatchComp)
    const padding = float(compStyles.paddingLeft) + float(compStyles.paddingRight)

    const contStyles = [getComputedStyle(firstContainer),
                    getComputedStyle(secondContainer)]
    const margin = float(contStyles[0].marginLeft) + float(contStyles[0].marginRight) +
                   float(contStyles[1].marginLeft) + float(contStyles[1].marginRight)

    let maxWidth = (innerWidth - padding - margin) / 2

    // get max height
    const position = currentStopwatch.getBoundingClientRect().y
    let maxHeight = (innerHeight * .4) - position - float(compStyles.paddingBottom)

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