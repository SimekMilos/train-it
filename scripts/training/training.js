
import TrainingInfo from "./training-info.js"
import Group from "./group.js"

const compContainer = document.querySelector(".tc-container")

const training = []


// --- Public ---

// Initialization

export function init(trainingData) {
    if (!trainingData) return

    // Add training info
    training.push(new TrainingInfo(trainingData, compContainer))

    // Add groups
    for (const groupData of trainingData.groups) {
        training.push(new Group(groupData, compContainer))
    }
}

export function destroy() {
    for (const trObj of training) trObj.destruct()
    training.length = 0
}

export function display() {

}

export function setTimer(timer) {

}


// Actions
let last = "set"

export function next() {
    /* return - "set" / "pause" / null (no next phase) */

    if (last == "pause") {
        last = "set"
        return "set"
    } else {
        last = "pause"
        return "pause"
    }

    // return "pause"
}

export function back() {
    /* return {
          phase: "set" / "pause" / null (no previous phase)
          time: Number    - current time of the previous phase
       }
    */

    return { phase: "pause", time: 123 }
}

export function isFirst() {
    /* return - true if current phase is the first one in the training */

    return false
}

export function isLast() {
    /* return - true if current phase is the last one in the training */

    return false
}

export function substractTime(time) {
    /* Substracts time from current phase */

}

export function resetPhase() {
    /* Resets current phase clock, not group or exercise clock */

}

export function reset() {

}