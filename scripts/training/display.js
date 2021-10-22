
import {px, float} from "../tools.js"

const mainScreen = document.querySelector(".main-screen")
const watchComponent = document.querySelector(".stopwatch-component")
const trainingComponent = document.querySelector(".training-component")
const noTrainings = document.querySelector(".tc-no-training")

const landscapeSizeFactor = 1
const portraitSizeFactor = .8


// Component sizing
new ResizeObserver(sizeComponent).observe(mainScreen)
new ResizeObserver(sizeNoTrainDisp).observe(mainScreen)


function sizeComponent() {
    const height = float(getComputedStyle(trainingComponent).height)
    trainingComponent.style.fontSize = px(0.03*height + 4.78)
}

function sizeNoTrainDisp() {
    // Positioning
    const screenHeight = mainScreen.getBoundingClientRect().height
    const watchHeight = watchComponent.getBoundingClientRect().height
    const top = (screenHeight + watchHeight) / 2
    noTrainings.style.top = px(top)

    // Sizing
    const width = mainScreen.getBoundingClientRect().width
    const height = trainingComponent.getBoundingClientRect().height
    const min = Math.min(width, height)

    let sizeFactor = landscapeSizeFactor
    if (matchMedia("(orientation: portrait)").matches) {
        sizeFactor = portraitSizeFactor
    }

    noTrainings.style.width = px(sizeFactor * min)
    noTrainings.style.height = px(sizeFactor * min)
}