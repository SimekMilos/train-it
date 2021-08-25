
import {float, px} from "./tools.js"

const stopwatchComp = document.querySelector(".stopwatch-component")

const headings = document.querySelectorAll(".stopwatch-component h2")

const firstContainer = document.querySelector(".st-first-container")
const secondContainer = document.querySelector(".st-second-container")

const currentStopwatch = document.querySelector(".st-current-stopwatch")
const totalStopwatch = document.querySelector(".st-total-stopwatch")

// Constants
const headingHeightFactor = 0.2
const currWatchSizeRatio = 3.427
const totalWatchSizeRatio = 5.366
const watchFontMagnFactor = 1.25



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
    const outerPadding = float(compStyles.paddingLeft) + float(compStyles.paddingRight)

    const containerStyles = [getComputedStyle(firstContainer),
                             getComputedStyle(secondContainer)]

    const containerMargins = float(containerStyles[0].marginLeft)
                            + float(containerStyles[0].marginRight)
                            + float(containerStyles[1].marginLeft)
                            + float(containerStyles[1].marginRight)

    const currWatchMarginTop = float(getComputedStyle(currentStopwatch).marginTop)

    // compute max height
    const maxWatchWidth = (innerWidth - outerPadding - containerMargins) / 2
    const maxWatchHeight = (maxWatchWidth / currWatchSizeRatio) + currWatchMarginTop
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
    const containerHeight = float(getComputedStyle(firstContainer).height)
    const headingHeight = float(getComputedStyle(headings[0]).height)

    // set current watch size
    let marginTop = float(getComputedStyle(currentStopwatch).marginTop)
    let currWatchHeight = containerHeight - headingHeight
    currWatchHeight = currWatchHeight * watchFontMagnFactor - marginTop

    currentStopwatch.style.fontSize = px(currWatchHeight)

    // set total watch size
    marginTop = float(getComputedStyle(totalStopwatch).marginTop)
    let totalWatchHeight = currWatchHeight * (currWatchSizeRatio/totalWatchSizeRatio)
    totalWatchHeight = totalWatchHeight * watchFontMagnFactor - marginTop

    totalStopwatch.style.fontSize = px(totalWatchHeight)
}