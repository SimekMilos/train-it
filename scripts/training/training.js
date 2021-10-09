
//TODO - edit in screens.js if it should be called when trainingData == null


// --- Public ---

// Initialization

export function init(trainingData) {

}

export function destroy() {

}

export function display() {

}

export function setTimer(timer) {

}


// Actions

export function next() {
    /* return - "set" / "pause" / null (no next phase) */

    return "set"
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

    return true
}

export function resetPhase() {

}

export function reset() {

}