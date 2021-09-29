
import {px, float, range, wait, waitFor, sizeNotes} from "../tools.js"
import {addDynamicPadding} from "../tools.js"

const groupTemplate = document.querySelector(".ts-group-template")
const noGroupTemplate = document.querySelector(".ts-no-group-template")
const exerciseTemplate = document.querySelector(".ts-exercise-template")
const setTemplate = document.querySelector(".ts-set-template")

const trainingName = document.querySelector(".ts-training-name")
const trainingNotes = document.querySelector(".ts-training-notes")
const scrollContainer = document.querySelector(".ts-scroll-container")
const groupContainer = document.querySelector(".ts-group-container")

trainingNotes.addEventListener("input", sizeNotes)


export function createTraining(data) {
    trainingName.value = data.name
    trainingNotes.value = data.notes

    for (const group of data.groups) {
        groupContainer.append(createGroup(group))
        setGroupHeight(groupContainer.lastElementChild)
        groupContainer.lastElementChild.classList.add("enable-access")
    }
}

export function createGroup(data = null) {
    /* For both groups and no-groups
       Input - group object/null (empty group)
    */

    if (!data) data = {type: "group"}

    let groupFrag
    let exerCont

    // Sets up group header
    if (data.type == "group") {
        groupFrag = groupTemplate.content.cloneNode(true)
        const group = groupFrag.firstElementChild

        // Elements
        const name = group.querySelector(".ts-group-name")
        const notes = group.querySelector(".ts-group-notes")
        exerCont = group.querySelector(".ts-group-exercise-container")
        const buttonAddExercise = group.querySelector(".ts-group-add")
        const buttonClose = group.querySelector(".ts-group-close")

        // Events
        notes.addEventListener("input", sizeNotes)
        buttonAddExercise.addEventListener("click", () => addExercise(exerCont))
        buttonClose.addEventListener("click", () => removeGroup(group))

        // Load data
        if (data.name) {
            name.value = data.name
            notes.value = data.notes
        }

    // Sets up no-group
    } else {
        groupFrag = noGroupTemplate.content.cloneNode(true)
        exerCont = groupFrag.querySelector(".ts-no-group")
    }

    // Add exercises
    if (data.exercises) {
        for (const exercise of data.exercises) {
            exerCont.append(createExercise(exercise))
            exerCont.lastElementChild.classList.add("enable-access")
        }
    }

    return groupFrag
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
    buttonAddSet.addEventListener("click", () => {
        setContainer.append(createSet())
    })
    buttonClose.addEventListener("click", () => removeExercise(exercise))

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

export async function displayAnim(elem) {
    // Setup animation
    const height = getComputedStyle(elem).height
    elem.style.height = height
    elem.classList.add("display")

    await waitFor("animationend", elem)

    // Finish displaying
    elem.classList.add("enable-access")
    elem.classList.remove("display")
    elem.style.removeProperty("height")
}

export async function hideAnim(elem) {
    elem.classList.remove("enable-access")

    // Setup animation
    const height = getComputedStyle(elem).height
    elem.style.height = height
    elem.classList.add("hide")

    await waitFor("animationend", elem)
    // Cleaning after is not necessary
}

export function setGroupHeight(group) {
    if (!group.classList.contains("ts-group")) return

    const exerContainer = group.querySelector(".ts-group-exercise-container")
    const noExerciseElem = group.querySelector(".ts-group-no-exercises")
    const noExerciseStyles = getComputedStyle(noExerciseElem)

    function setHeight() {
        let height = float(noExerciseStyles.height)
        height += float(noExerciseStyles.marginTop)
        height += float(noExerciseStyles.marginBottom)

        exerContainer.style.minHeight = px(height)
    }

    setHeight()
    new ResizeObserver(setHeight).observe(group)
}


// --- Private ---

// Group

function addExercise(exerciseContainer) {
    exerciseContainer.append(createExercise())
    displayAnim(exerciseContainer.lastElementChild)
}

async function removeGroup(group) {
    // Adds filler padding
    const style = getComputedStyle(group)
    const height = float(style.height) + float(style.marginTop)
                    + float(style.marginBottom)
    const remPadd = addDynamicPadding(height, scrollContainer)

    // Remove group
    await hideAnim(group)
    group.remove()

    // Scroll up
    await wait(100)
    remPadd(250)
}


// Exercise

async function removeExercise(exercise) {
    const style = getComputedStyle(exercise)
    const noGroup = exercise.closest(".ts-no-group")
    let height = float(style.height) + float(style.marginBottom)

    // When removing no-group, account for no-group bottom padding
    const removeNoGroup = noGroup && noGroup.children.length == 1
    if (removeNoGroup) height += float(getComputedStyle(noGroup).marginBottom)

    // Adds filler padding
    const remPadd = addDynamicPadding(height, scrollContainer)

    // Remove exercise
    await hideAnim(exercise)
    if (removeNoGroup) noGroup.remove()
    else               exercise.remove()

    // Scroll up
    await wait(100)
    remPadd(250)
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