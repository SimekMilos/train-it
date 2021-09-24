
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
    trData.notes = trainingNotes.textContent

    // Check if there is at least one excercise
    if (!groupContainer.querySelector(":scope .ts-exercise")) {
        throw new ReadError("Training must have at least one excercise")
    }

    // Read groups

    return trData
}


function readGroup(groupElem) {
    /* Both for groups and no-groups */

}


function readExcercise(excerciseElem) {

}