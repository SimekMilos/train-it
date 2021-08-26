
import {float, px, range} from "./tools.js"

const stopwatchComp = document.querySelector(".stopwatch-component")

const headings = document.querySelectorAll(".stopwatch-component h2")

const firstContainer = document.querySelector(".st-first-container")
const secondContainer = document.querySelector(".st-second-container")

const currentStopwatch = document.querySelector(".st-current-stopwatch")
const totalStopwatch = document.querySelector(".st-total-stopwatch")

const mainCtrContainer = document.querySelector(".st-main-controls")
const buttons = document.querySelectorAll(".st-main-controls > *")

// Constants
const headingHeightFactor = 0.2
const bottomPaddingHeightFactor = 0.1
const currWatchSizeRatio = 3.42
const totalWatchSizeRatio = 5.34
const watchFontMagnFactor = 1.25



// temporary - activate when first displaying stopwatch
//           - deactivate when stopwatch is hidden

function onAppLoad() {
    onResize()
    window.addEventListener("resize", onResize)
}

window.addEventListener("load", onAppLoad)

function onResize() {
    for (const _ of range(2)) {     // some situations need 2 passes
        setComponentHeight()
        setHeadingHeight()
        setStopwatchSize()
        setMainControls()
        setBottomPadding()
    }
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

    // compute max height constraint
    const maxWatchWidth = (innerWidth - outerPadding - containerMargins) / 2
    const maxWatchHeight = maxWatchWidth / currWatchSizeRatio
    const maxHeight = maxWatchHeight / (1 - headingHeightFactor - bottomPaddingHeightFactor)
    if (height > maxHeight) height = maxHeight

    // set height
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
    let currWatchHeight = containerHeight - headingHeight - marginTop
    currWatchHeight = currWatchHeight * watchFontMagnFactor

    currentStopwatch.style.fontSize = px(currWatchHeight)

    // set total watch size
    marginTop = float(getComputedStyle(totalStopwatch).marginTop)
    const width = float(getComputedStyle(firstContainer).width)
    const totalWatchHeight = width / totalWatchSizeRatio - marginTop

    totalStopwatch.style.fontSize = px(totalWatchHeight * watchFontMagnFactor)
}

function setMainControls() {
    const offset = .06

    // set top margin
    const compHeight = float(getComputedStyle(stopwatchComp).height)
    mainCtrContainer.style.marginTop = px(offset * compHeight)

    // set space between
    for (const [index, button] of buttons.entries()) {
        if (index == buttons.length - 1) break          // not the last one

        button.style.marginRight = px(offset * compHeight)
    }

    // set font size
    const height = float(getComputedStyle(buttons[0]).height)
    for (const button of buttons) {
        button.style.fontSize = px(.5 * height)
    }

    // set border
    let borderWidth = .04 * height
    if (borderWidth < 1) borderWidth = 1
    if (borderWidth > 2) borderWidth = 2

    for (const button of buttons) {
        button.style.borderWidth = px(borderWidth)
        button.style.borderRadius = px(2 * borderWidth)
    }
}

function setBottomPadding() {
    const compHeight = float(getComputedStyle(stopwatchComp).height)
    stopwatchComp.style.paddingBottom = px(compHeight * bottomPaddingHeightFactor)
}