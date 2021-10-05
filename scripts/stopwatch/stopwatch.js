

export function init(trainingData) {
    // training: null - starts timer, obj - starts training

}

export function destroy() {

}


// Temporary
import {transitionToInitScreen} from "../screens.js"

const closeButton = document.querySelector(".ts-close")
closeButton.addEventListener("click", onClose)

function onClose() {
    transitionToInitScreen()
}