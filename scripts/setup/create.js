
import {px, float, range, wait, waitFor, sizeNotes} from "../tools.js"
import {addDynamicPadding, dynamicScrollDown} from "../tools.js"

const component = document.querySelector(".training-setup-component")
const trainingName = document.querySelector(".ts-training-name")
const trainingNotes = document.querySelector(".ts-training-notes")
const addControls = document.querySelector(".ts-add-controls")

const scrollContainer = document.querySelector(".ts-scroll-container")
const groupContainer = document.querySelector(".ts-group-container")
const noExerciseDisp = document.querySelector(".ts-no-exercises")

const groupTemplate = document.querySelector(".ts-group-template")
const noGroupTemplate = document.querySelector(".ts-no-group-template")
const exerciseTemplate = document.querySelector(".ts-exercise-template")
const setTemplate = document.querySelector(".ts-set-template")


// ===== Public =====

export function createTraining(data) {
    hideNoDisplay(noExerciseDisp)

    trainingName.value = data.name
    trainingNotes.value = data.notes

    for (const group of data.groups) {
        groupContainer.append(createGroup(group))
        setGroupHeight(groupContainer.lastElementChild)
    }
}

export function createGroup(data = null) {
    /* For both groups and no-groups
       Input - group object/null (empty group)
    */

    if (!data) data = {type: "group"}

    let groupFrag
    let exerContainer

    // Sets up group header
    if (data.type == "group") {
        groupFrag = groupTemplate.content.cloneNode(true)
        const group = groupFrag.firstElementChild

        // Elements
        const name = group.querySelector(".ts-group-name")
        const notes = group.querySelector(".ts-group-notes")
        exerContainer = group.querySelector(".ts-group-exercise-container")
        const noExerciseDisp = group.querySelector(".ts-group-no-exercises")
        const buttonAddExercise = group.querySelector(".ts-group-add")
        const buttonClose = group.querySelector(".ts-group-close")

        // Events
        notes.addEventListener("input", sizeNotes)
        buttonAddExercise.addEventListener("click", () => {
            addTrainingItem("exercise", exerContainer)
        })
        buttonClose.addEventListener("click", () => removeGroup(group))

        // Load data
        if (data.name) {
            name.value = data.name
            notes.value = data.notes

            hideNoDisplay(noExerciseDisp)
            if (!data.exercises.length) throw new Error("Incorrect data")
        }

    // Sets up no-group
    } else {
        groupFrag = noGroupTemplate.content.cloneNode(true)
        exerContainer = groupFrag.querySelector(".ts-no-group")
    }

    // Add exercises
    if (data.exercises) {
        for (const exercise of data.exercises) {
            exerContainer.append(createExercise(exercise))
        }
    }

    return groupFrag
}

export async function addTrainingItem(type, container) {
    /* Adds training item with intro animation and necessary scrolling

    type - "group" or "exercise"
    container - container to add to
    */

    component.classList.remove("enable-access")
    let trainingItem = appendToContainer(container, type)

    // Get top scrolling position
    let topScrollPos = trainingItem.getBoundingClientRect().top
    topScrollPos -= 10          // 10px offset from top

    // Get bottom scrolling position
    let bottomScrollPos = addControls.getBoundingClientRect().bottom
    bottomScrollPos += float(getComputedStyle(addControls).marginBottom)

        // Bottom position for exercise inside group that is not at the end
    const group = container.closest(".ts-group")
    if (group && group != groupContainer.lastElementChild) {
        bottomScrollPos = group.getBoundingClientRect().bottom
        bottomScrollPos += 10       // 10px offset from bottom
    }

    // Compute scroll distance
    const scroll = computeScrollDist(topScrollPos, bottomScrollPos)

    // Remove item before scrolling (cannot be visible during scroll)
    trainingItem.remove()

    // Scroll down
    let removePadd = null
    if (scroll) removePadd = await dynamicScrollDown(scroll, 250, scrollContainer)
    await wait(100)

    // Hide no-training displays
    hideNoDisplay(noExerciseDisp)
    if (group) hideNoDisplay(group.querySelector(".ts-group-no-exercises"))

    // Add elem
    container.append(trainingItem)
    await displayAnim(trainingItem)

    if (removePadd) removePadd()
    component.classList.add("enable-access")
}


// ===== Private =====

trainingNotes.addEventListener("input", sizeNotes)


// --- Group ---

function setGroupHeight(group) {
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

async function removeGroup(group) {
    component.classList.remove("enable-access")

    // Test if group is in between of no-groups
    const previous = group.previousElementSibling
    const next = group.nextElementSibling
    const noGroups = previous && previous.classList.contains("ts-no-group") &&
                     next && next.classList.contains("ts-no-group")

    // Add filler padding
    const style = getComputedStyle(group)
    const height = float(style.height) + float(style.marginTop)
                    + float(style.marginBottom)
    const remPadd = addDynamicPadding(height, scrollContainer)

    // Remove group
    if (noGroups) previous.classList.add("hide-bottom-margin")
    await hideAnim(group)
    group.remove()

    if (groupContainer.children.length == 1) displayNoDisplay(noExerciseDisp)

    // Merge no-groups
    if (noGroups) {
        previous.append(...next.children)
        next.remove()
        previous.classList.remove("hide-bottom-margin")
    }

    // Scroll up
    await wait(100)
    await remPadd(250)
    component.classList.add("enable-access")
}


// --- Exercise ---

function createExercise(data = null) {
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

async function removeExercise(exercise) {
    component.classList.remove("enable-access")

    const style = getComputedStyle(exercise)
    const group = exercise.closest(".ts-group")
    const noGroup = exercise.closest(".ts-no-group")
    let exerHeight = float(style.height) + float(style.marginBottom)

    // When removing no-group, account for no-group bottom padding
    const removeNoGroup = noGroup && noGroup.children.length == 1
    if (removeNoGroup) exerHeight += float(getComputedStyle(noGroup).marginBottom)

    // Adds filler padding
    const remPadd = addDynamicPadding(exerHeight, scrollContainer)

    // Remove exercise
    if (removeNoGroup) noGroup.classList.add("hide-bottom-margin")
    await hideAnim(exercise, removeNoGroup)
    if (removeNoGroup) noGroup.remove()
    else               exercise.remove()

    // Display no-exercises displays
    if (groupContainer.children.length == 1) displayNoDisplay(noExerciseDisp)
    if (group) {
        const exerCont = group.querySelector(".ts-group-exercise-container")
        const noExerciseDisp = exerCont.firstElementChild
        if (exerCont.children.length == 1) displayNoDisplay(noExerciseDisp)
    }

    // Scroll up
    await wait(100)
    await remPadd(250)
    component.classList.add("enable-access")
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


// --- Other ---

function appendToContainer(container, type) {
    // Save current scroll position - adding element can scroll, container
    const currScroll = scrollContainer.scrollTop    // in Chrome and Opera

    if (type == "group") {
        container.append(createGroup())
        setGroupHeight(container.lastElementChild)

    } else {  // exercise
        container.append(createExercise())
    }

    scrollContainer.scrollTop = currScroll
    return container.lastElementChild
}

function computeScrollDist(topPos, bottomPos) {
    const {top: contTop,
           bottom: contBottom} = scrollContainer.getBoundingClientRect()

    const scrollTop = topPos - contTop
    const scrollBottom = bottomPos - contBottom

    let scroll = Math.min(scrollTop, scrollBottom)
    if (scroll < 0) scroll = 0

    return scroll
}

async function displayAnim(elem) {
    // Setup animation
    const height = getComputedStyle(elem).height
    elem.style.height = height
    elem.classList.add("display")

    await waitFor("animationend", elem)

    // Finish displaying
    elem.classList.remove("display")
    elem.style.removeProperty("height")
}

async function hideAnim(elem, only = false) {
    // Setup animation
    const height = getComputedStyle(elem).height
    elem.style.height = height

    if (!only) elem.classList.add("hide")
    else       elem.classList.add("hide-only")

    await waitFor("animationend", elem)
    // Cleaning after is not necessary - element will be removed
}

function hideNoDisplay(noDisplay) {
    noDisplay.classList.remove("smooth-display")
    noDisplay.style.opacity = 0
}

function displayNoDisplay(noDisplay) {
    noDisplay.classList.add("smooth-display")
    noDisplay.style.opacity = 1
}