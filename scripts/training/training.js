
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
    for (const group of groups) group.destruct()
    groups.length = 0

    if (trainingInfo) {
        trainingInfo.destruct()
        trainingInfo = null
    }

    timer = null
    activeGroupIndex = 0
}

export function display() {

}

export function setTimer(timerObj) {
    timer = timerObj
}


// Actions

export function countdown(active) {
    groups[0].isNext = active
}

export function start() {
    activeGroupIndex = 0
    groups[0].activate(timer)
}

export function pause(paused) {
    prepareNextExercise(!paused)
    groups[activeGroupIndex].prepareNextExercise(!paused)

    if (!paused) {
        groups[activeGroupIndex].currentExercise.scrollActiveSetIntoView()
    }
}

export function resetPhase() {
    /* Resets current phase clock, not group or exercise clock */

    const currentExercise = groups[activeGroupIndex].currentExercise

    currentExercise.currentSet.currentTime = 0
    currentExercise.scrollActiveSetIntoView()
}

export function reset() {
    /* Resets whole training */

    for (const group of groups) group.reset()
}


export function next() {
    /* Moves 1 phase forward

       return: new phase - "set" / "pause" / null (no next phase)
    */

    let nextPhase
    [nextPhase, activeGroupIndex] = setNextPhase(groups, activeGroupIndex,
                                                 timer)
    prepareNextExercise(true)
    return nextPhase
}

export function back() {
    /* Moves 1 phase back
       Clears all clocks (set, exercise, group) related to the next phase.

       return: new phase - "set" / "pause" / null (no previous phase)
    */
    prepareNextExercise(false)

    let prevPhase
    [prevPhase, activeGroupIndex] = setPreviousPhase(groups, activeGroupIndex,
                                                     timer)
    if (!prevPhase) {   // Resets display if first
        groups[0].deactivate()
        groups[0].activate(timer)
    }
    return prevPhase
}

export function isLastPhase() {
    /* Returns true if current phase is the last one in the training */

    if (activeGroupIndex < groups.length - 1) return false
    return groups[activeGroupIndex].isLastPhase()
}

export function getCurrentTime() {
    /* Gets time of current phase */

    return groups[activeGroupIndex].currentExercise.currentSet.currentTime
}

export function addTime(time) {
    /* Adds time to current phase */

    const currentSet = groups[activeGroupIndex].currentExercise.currentSet
    currentSet.currentTime = currentSet.currentTime + time
}

export function substractTime(time) {
    /* Subtracts time from current phase */

    const currentSet = groups[activeGroupIndex].currentExercise.currentSet
    currentSet.currentTime = currentSet.currentTime - time
}


// --- Private ---

function prepareNextExercise(isNext) {
    if (groups[activeGroupIndex].isLastPhase() &&
        activeGroupIndex < groups.length - 1) {

        groups[activeGroupIndex+1].isNext = isNext
    }
}