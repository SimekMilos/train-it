
import {range, waitFor, sizeNotes} from "../tools.js"

const groupTemplate = document.querySelector(".ts-group-template")
const noGroupTemplate = document.querySelector(".ts-no-group-template")
const exerciseTemplate = document.querySelector(".ts-exercise-template")
const setTemplate = document.querySelector(".ts-set-template")

const trainingName = document.querySelector(".ts-training-name")
const trainingNotes = document.querySelector(".ts-training-notes")
const groupContainer = document.querySelector(".ts-group-container")

trainingNotes.addEventListener("input", sizeNotes)


export function createTraining(data) {
    trainingName.value = data.name
    trainingNotes.value = data.notes

    for (const group of data.groups) {
        groupContainer.append(createGroup(group))
    }
}

export function createGroup(data = null) {
    /* For both groups and no-groups
       Input - group object/null (empty group)
    */

    if (!data) data = {type: "group"}

    let group
    let exerciseContainer

    // Sets up group header
    if (data.type == "group") {
        group = groupTemplate.content.cloneNode(true)
        const groupElem = group.firstElementChild

        // Elements
        const name = group.querySelector(".ts-group-name")
        const notes = group.querySelector(".ts-group-notes")
        exerciseContainer = group.querySelector(".ts-group-exercise-container")
        const buttonAddExercise = group.querySelector(".ts-group-add")
        const buttonClose = group.querySelector(".ts-group-close")

        // Events
        notes.addEventListener("input", sizeNotes)
        buttonAddExercise.addEventListener("click", () => {
            exerciseContainer.append(createExercise())
            displayExercise(exerciseContainer.lastElementChild)
        })
        buttonClose.addEventListener("click", () => groupElem.remove())

        // Load data
        if (data.name) {
            name.value = data.name
            notes.value = data.notes
        }

    // Sets up no-group
    } else {
        group = noGroupTemplate.content.cloneNode(true)
        exerciseContainer = group.querySelector(".ts-no-group")
    }

    // Add exercises
    if (data.exercises) {
        for (const exercise of data.exercises) {
            exerciseContainer.append(createExercise(exercise))
        }
    }

    return group
}

export function createExercise(data = null) {
    /* Input - exercise object/null (empty exercise) */

    const exerciseFrag = exerciseTemplate.content.cloneNode(true)
    const exercise = exerciseFrag.firstElementChild

    // Elements
    const name = exercise.querySelector(".ts-exercise-name")
    const notes = exercise.querySelector(".ts-exercise-notes")
    const setContainer = exercise.querySelector(".ts-exercise-set-container")
    const buttonAddSet = exercise.querySelector(".ts-exercise-add-set")
    const buttonClose = exercise.querySelector(".ts-exercise-close")

    // Events
    notes.addEventListener("input", sizeNotes)
    buttonClose.addEventListener("click", async () => {
        buttonClose.disabled = true
        await hideExercise(exercise)
        deleteExercise(exercise)
    })
    buttonAddSet.addEventListener("click", () => {
        setContainer.append(createSet())
    })

    // Setup exercise
    if (data) {
        name.value = data.name
        notes.textContent = data.notes

        // Setup sets
        for (const setName of data.sets) {
            setContainer.append(createSet(setName))
        }

    // Default
    } else {
        for (const _ of range(3)) setContainer.append(createSet())
    }

    return exerciseFrag
}

export async function displayExercise(elem) {
    const height = getComputedStyle(elem).height
    elem.style.height = height
    elem.classList.add("display")

    await waitFor("animationend", elem)
    elem.classList.remove("display")
    elem.style.removeProperty("height")
}

export async function hideExercise(elem) {
    const height = getComputedStyle(elem).height
    elem.style.height = height
    elem.classList.add("hide")

    await waitFor("animationend", elem)
}


// --- Private ---

function deleteExercise(exercise) {
    const noGroup = exercise.closest(".ts-no-group")

    if (noGroup && noGroup.children.length == 1) noGroup.remove()
    else                                         exercise.remove()
}

function createSet(setName = null) {
    const setFrag = setTemplate.content.cloneNode(true)
    const set = setFrag.firstElementChild

    // Set name
    if (setName) {
        const name = set.querySelector(".ts-set-name")
        name.value = setName
    }

    // Setup close button
    const closeButton = setFrag.querySelector(".ts-set-close")
    closeButton.addEventListener("click", () => set.remove())

    return setFrag
}

