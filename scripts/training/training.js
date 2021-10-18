
import {setNextPhase, setPreviousPhase} from "./training-tools.js"

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

    let nextPhase
    [nextPhase, activeGroupIndex] = setNextPhase(groups, activeGroupIndex,
                                                 timer)
    return nextPhase
}

export function back() {
    /* Goes 1 phase back
       Clears all clocks (set, exercise, group) related to the next phase.

       return: new phase - "set" / "pause" / null (no previous phase)
    */

    let prevPhase
    [prevPhase, activeGroupIndex] = setPreviousPhase(groups, activeGroupIndex,
                                                     timer)
    return prevPhase
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

export function getCurrentTime() {
    return groups[activeGroupIndex].currentSet.currentTime
}

export function addTime(time) {
    /* Adds time to current phase */

    const currentSet = groups[activeGroupIndex].currentSet
    currentSet.currentTime = currentSet.currentTime + time
}

export function substractTime(time) {
    /* Substracts time from current phase */

    const currentSet = groups[activeGroupIndex].currentSet
    currentSet.currentTime = currentSet.currentTime - time
}

export function resetPhase() {
    /* Resets current phase clock, not group or exercise clock */

    groups[activeGroupIndex].currentSet.currentTime = 0
}

export function reset() {

}