
const trainingName = document.querySelector(".ts-training-name")
const trainingNotes = document.querySelector(".ts-training-notes")
const groupContainer = document.querySelector(".ts-group-container")


export class ReadError extends Error {
    constructor(message) {
        super(message)
        this.name = "ReadError"
    }
}

export function readTraining() {
    const trData = {}

    // Read and check training name
    const nameStr = trainingName.value.trim()
    if (!nameStr) throw new ReadError("Training must have name")
    trData.name = nameStr

    // Read training notes
    trData.notes = trainingNotes.value

    // Check if there is at least one excercise
    if (!groupContainer.querySelector(":scope .ts-exercise")) {
        throw new ReadError("Training must have at least one excercise")
    }

    // Read groups
    trData.groups = []
    const groups = Array.from(groupContainer.children).slice(1)
    for (const group of groups) {
        trData.groups.push(readGroup(group))
    }

    return trData
}


function readGroup(groupElem) {
    /* For both groups and no-groups */

}


function readExcercise(excerciseElem) {

}