
import {px, float} from "./tools.js"

// No training display sizing and positioning

const mainScreen = document.querySelector(".main-screen")
const watchComponent = document.querySelector(".stopwatch-component")
const trainingComponent = document.querySelector(".training-component")
const noTrainings = document.querySelector(".tc-no-training")

const landscapeSizeFactor = 1
const portraitSizeFactor = .8

function onResize() {
    // Positioning
    const screenHeight = mainScreen.getBoundingClientRect().height
    const watchHeight = watchComponent.getBoundingClientRect().height
    const top = (screenHeight + watchHeight) / 2
    noTrainings.style.top = px(top)

    // Sizing
    const {width, height} = trainingComponent.getBoundingClientRect()
    const min = Math.min(width, height)

    let sizeFactor = landscapeSizeFactor
    if (matchMedia("(orientation: portrait)").matches) {
        sizeFactor = portraitSizeFactor
    }

    noTrainings.style.width = px(sizeFactor * min)
    noTrainings.style.height = px(sizeFactor * min)
}

// Temporary - activate od displaying

function onLoad() {
    onResize()
}

window.addEventListener("load", onLoad)

new ResizeObserver(onResize).observe(trainingComponent)