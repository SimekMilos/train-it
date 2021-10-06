
import * as display from "./display.js"

export function init(trainingData) {
    /* trainingData: null - starts timer, obj - starts training */

    display.activateSizingAlg()
}

export function destroy() {
    display.deactivateSizingAlg()
}


// Temporary
import {transitionToInitScreen} from "../screens.js"

const closeButton = document.querySelector(".ts-close")
closeButton.addEventListener("click", onClose)

function onClose() {
    transitionToInitScreen()
}