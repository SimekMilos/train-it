
import {setNextPhase} from "./training-tools.js"

import {} from "./display.js"
import TrainingInfo from "./training-info.js"
import Group from "./group.js"
import * as notes from "./notes.js"

const compContainer = document.querySelector(".tc-container")

const groups = []
let activeGroupIndex = 0
let trainingInfo = null
let timer = null


// --- Public ---

// Initialization

export function init(trainingData) {
    if (!trainingData) return
    notes.setDataStructure(trainingData)

    // Add training info
    trainingInfo = new TrainingInfo(trainingData, compContainer)

    // Add groups
    for (const groupData of trainingData.groups) {
        groups.push(new Group(groupData, compContainer))
    }
}

export function destroy() {
    trainingInfo.destruct()

    for (const group of groups) group.destruct()
    groups.length = 0
}

export function display() {

}

export function setTimer(timerObj) {
    timer = timerObj

    activeGroupIndex = 0
    groups[0].activate(timer)
}


// Actions

export function next() {
    /* return - "set" / "pause" / null (no next phase) */

    let phase
    [phase, activeGroupIndex] = setNextPhase(groups, activeGroupIndex, timer)
    return phase
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

    if (activeGroupIndex < groups.length - 1) return false
    return groups[activeGroupIndex].isLast()
}

export function substractTime(time) {
    /* Substracts time from current phase */

}

export function resetPhase() {
    /* Resets current phase clock, not group or exercise clock */

}

export function reset() {

}