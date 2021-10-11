
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
    /* Resets current phase clock, not group clock */

}

export function reset() {

}