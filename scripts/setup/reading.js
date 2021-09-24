
const trainingName = document.querySelector(".ts-training-name")
const trainingNotes = document.querySelector(".ts-training-notes")
const groupContainer = document.querySelector(".ts-group-container")


// --- Interface ---

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
    if (!nameStr) throw new ReadError("Training must have name.")
    trData.name = nameStr

    // Read training notes
    trData.notes = trainingNotes.value

    // Check if there is at least one exercise
    if (!groupContainer.querySelector(":scope .ts-exercise")) {
        throw new ReadError("Training must have at least one exercise.")
    }

    // Read groups
    trData.groups = []
    const groups = Array.from(groupContainer.children).slice(1)
    for (const group of groups) {
        trData.groups.push(readGroup(group))
    }

    return trData
}


// --- Private ---

function readGroup(groupElem) {
    /* For both groups and no-groups */

    const groupData = {}

    const nameElem = groupElem.querySelector(":scope .ts-group-name")
    const notesElem = groupElem.querySelector(":scope .ts-group-notes")
    let exerciseContainer

    // Detect and save type
    if (groupElem.classList.contains("ts-group")) {
        groupData.type = "group"
        exerciseContainer = groupElem.querySelector(":scope .ts-group-exercise-container")
    }
    else {
        groupData.type = "no-group"
        exerciseContainer = groupElem
    }

    // Read and check group name
    if (nameElem) {
        const nameStr = nameElem.value.trim()
        if (!nameStr) throw new ReadError("Group must have name.")
        groupData.name = nameStr
    }

    // Read notes
    if (notesElem) groupData.notes = notesElem.value

    // Check if there is at least one exercise
    if (!groupElem.querySelector(":scope .ts-exercise")) {
        throw new ReadError("Group must have at least one exercise.")
    }

    // Read exercises
    groupData.exercises = []
    let exercises = Array.from(exerciseContainer.children)
    if (groupData.type == "group") exercises = exercises.slice(1)

    for (const exercise of exercises) {
        groupData.exercises.push(readExercise(exercise))
    }

    return groupData
}

function readExercise(exerciseElem) {
    const exerciseData = {}

    const nameElem = exerciseElem.querySelector(":scope .ts-exercise-name")
    const notesElem = exerciseElem.querySelector(":scope .ts-exercise-notes")
    const setContainer = exerciseElem.querySelector(":scope .ts-exercise-set-container")

    // Read and check exercise name
    const nameStr = nameElem.value.trim()
    if (!nameStr) throw new ReadError("Exercise must have name.")
    exerciseData.name = nameStr

    // Read exercise notes
    exerciseData.notes = notesElem.value

    // Check if there is at least one set
    if (!setContainer.children.length) {
        throw new ReadError("Exercise must have at least one set.")
    }

    // Read sets
    exerciseData.sets = []
    for (const set of setContainer.children) {
        const setName = set.querySelector(":scope .ts-set-name")
        const nameStr = setName.value.trim()
        if (nameStr) exerciseData.sets.push(nameStr)
        else         exerciseData.sets.push(null)    // Set with default naming
    }

    return exerciseData
}