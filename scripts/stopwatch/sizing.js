
import {float, px, range} from "../tools.js"

const mainScreen = document.querySelector(".main-screen")
const stopwatchComp = document.querySelector(".stopwatch-component")

const headings = document.querySelectorAll(".stopwatch-component h2")

const firstContainer = document.querySelector(".st-first-container")
const secondContainer = document.querySelector(".st-second-container")

const currentStopwatch = document.querySelector(".st-current-stopwatch")
const totalStopwatch = document.querySelector(".st-total-stopwatch")

const mainCtrContainer = document.querySelector(".st-main-controls")
const buttons = document.querySelectorAll(".st-main-controls > *")

const resizeObserver = new ResizeObserver(onResize)

// Constants
const headingHeightFactorLandscape = 0.2
const headingHeightFactorPortrait  = 0.25
const bottomPaddingHeightFactor = 0.1

const currWatchSizeRatio = 3.285
const totalWatchSizeRatio = 5.2
const watchFontMagnFactor = 1.25

const buttonOffset = 0.06



// --- Public ---

export function activate() {
    onResize()
    resizeObserver.observe(mainScreen)
}

export function deactivate() {
    resizeObserver.disconnect()
}


// --- Private ---

function onResize() {
    for (const _ of range(2)) {     // some situations need 2 passes
        setComponentHeight()
        setBottomPadding()
        setContainerHeight()
        setContainerOffset()
        setHeadingHeight()
        setStopwatchSize()
        setMainControls()
    }
}

function setComponentHeight() {
    let height = innerHeight * .4   // size should be 2/5 of viewport
    let maxHeight

    const containerStyles = [getComputedStyle(firstContainer),
                             getComputedStyle(secondContainer)]

    // Landscape mode
    if (matchMedia("(orientation: landscape)").matches) {
        // compute paddings and margins
        const compStyles = getComputedStyle(stopwatchComp)
        const outerPadding = float(compStyles.paddingLeft) + float(compStyles.paddingRight)

        const contMarginSum = float(containerStyles[0].marginLeft)
                            + float(containerStyles[0].marginRight)
                            + float(containerStyles[1].marginLeft)
                            + float(containerStyles[1].marginRight)

        // compute max height constraint
        const maxWatchWidth = (innerWidth - outerPadding - contMarginSum) / 2
        const maxWatchHeight = maxWatchWidth / currWatchSizeRatio
        maxHeight = maxWatchHeight
                    / (1 - headingHeightFactorLandscape - bottomPaddingHeightFactor)

    // Portrait mode
    } else {
        const maxWatchWidth = innerWidth - float(containerStyles[0].marginLeft)
                                - float(containerStyles[0].marginRight)
        const maxWatchHeight = maxWatchWidth / currWatchSizeRatio

        maxHeight = 2*maxWatchHeight
                        / (1 - headingHeightFactorPortrait - bottomPaddingHeightFactor)
    }

    // set height
    if (height > maxHeight) height = maxHeight
    stopwatchComp.style.height = px(height)
}

function setBottomPadding() {
    const compHeight = float(getComputedStyle(stopwatchComp).height)
    let paddingFactor = bottomPaddingHeightFactor

    if (matchMedia("(orientation: portrait)").matches) {
        paddingFactor /= 2
    }

    stopwatchComp.style.paddingBottom = px(compHeight * paddingFactor)
}

function setContainerHeight() {
    if(matchMedia("(orientation: portrait)").matches) {
        const compStyles = getComputedStyle(stopwatchComp)

        const compHeight = float(compStyles.height)
        const compBottPadding = float(compStyles.paddingBottom)
        const topMargin = float(getComputedStyle(secondContainer).marginTop)

        const height = (compHeight - compBottPadding - topMargin) / 2

        firstContainer.style.height = px(height)
        secondContainer.style.height = px(height)

    } else {
        if (firstContainer.style.height) {
            firstContainer.style.removeProperty("height")
            secondContainer.style.removeProperty("height")
        }
    }
}

function setContainerOffset() {
    if(matchMedia("(orientation: portrait)").matches) {
        const compHeight = float(getComputedStyle(stopwatchComp).height)
        const marginFactor = bottomPaddingHeightFactor / 2

        secondContainer.style.marginTop = px(compHeight * marginFactor)
    } else {
        secondContainer.style.removeProperty("margin-top")
    }
}

function setHeadingHeight() {
    const compHeight = float(getComputedStyle(stopwatchComp).height)

    // Compute heading height
    let headingHeight
    if (matchMedia("(orientation :landscape)").matches) {
        headingHeight = compHeight * headingHeightFactorLandscape
    } else {
        headingHeight = compHeight * headingHeightFactorPortrait / 2
    }

    // Set headings
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
    // get offset
    let offset = buttonOffset
    if (matchMedia("(orientation: portrait)").matches) {
        offset /= 2
    }

    // set top margin
    const compHeight = float(getComputedStyle(stopwatchComp).height)
    mainCtrContainer.style.marginTop = px(offset * compHeight)

    // set space between
    for (const [index, button] of buttons.entries()) {
        if (index == buttons.length - 1) break          // not the last one

        button.style.marginRight = px(offset * compHeight)
    }

    // set font size & border
    const height = float(getComputedStyle(buttons[0]).height)
    for (const button of buttons) {
        button.style.fontSize = px(.5 * height)
        button.style.borderRadius = px(.1 * height)
    }
}