
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

const currWatchSizeRatio = 3.285
const totalWatchSizeRatio = 5.2
const watchFontMagnFactor = 1.25

const buttonOffset = 0.06


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
    let maxHeight

    const containerStyles = [getComputedStyle(firstContainer),
                             getComputedStyle(secondContainer)]

    // Landskape mode
    if (matchMedia("(orientation: landscape)").matches) {
        // compute paddings and margins
        const compStyles = getComputedStyle(stopwatchComp)
        const outerPadding = float(compStyles.paddingLeft) + float(compStyles.paddingRight)

        const contMarginSum = float(containerStyles[0].marginLeft)
                            + float(containerStyles[0].marginRight)
                            + float(containerStyles[1].marginLeft)
                            + float(containerStyles[1].marginRight)

        const currWatchMarginTop = float(getComputedStyle(currentStopwatch).marginTop)

        // compute max height constraint
        const maxWatchWidth = (innerWidth - outerPadding - contMarginSum) / 2
        const maxWatchHeight = maxWatchWidth / currWatchSizeRatio
        maxHeight = maxWatchHeight
                        / (1 - headingHeightFactor - bottomPaddingHeightFactor)

    // Portrait mode
    } else {
        const maxWatchWidth = innerWidth - float(containerStyles[0].marginLeft)
                                - float(containerStyles[0].marginRight)
        const maxWatchHeight = maxWatchWidth / currWatchSizeRatio

        maxHeight = (2*maxWatchHeight + bottomPaddingHeightFactor/2)
                        / (1 - headingHeightFactor)
    }

    // set height
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
    // set top margin
    const compHeight = float(getComputedStyle(stopwatchComp).height)
    mainCtrContainer.style.marginTop = px(buttonOffset * compHeight)

    // set space between
    for (const [index, button] of buttons.entries()) {
        if (index == buttons.length - 1) break          // not the last one

        button.style.marginRight = px(buttonOffset * compHeight)
    }

    // set font size & border
    const height = float(getComputedStyle(buttons[0]).height)
    for (const button of buttons) {
        button.style.fontSize = px(.5 * height)
        button.style.borderRadius = px(.1 * height)
    }
}

function setBottomPadding() {
    const compHeight = float(getComputedStyle(stopwatchComp).height)
    stopwatchComp.style.paddingBottom = px(compHeight * bottomPaddingHeightFactor)
}