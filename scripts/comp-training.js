
import {px, float, range, sizeNotes} from "./tools.js"

// No training display sizing and positioning

const mainScreen = document.querySelector(".main-screen")
const watchComponent = document.querySelector(".stopwatch-component")
const trainingComponent = document.querySelector(".training-component")
const noTrainings = document.querySelector(".tc-no-training")

const landscapeSizeFactor = 1
const portraitSizeFactor = .8

function resizeNoTrainDisp() {
    // Positioning
    const screenHeight = mainScreen.getBoundingClientRect().height
    const watchHeight = watchComponent.getBoundingClientRect().height
    const top = (screenHeight + watchHeight) / 2
    noTrainings.style.top = px(top)

    // Sizing
    const width = mainScreen.getBoundingClientRect().width
    const height = trainingComponent.getBoundingClientRect().height
    const min = Math.min(width, height)

    let sizeFactor = landscapeSizeFactor
    if (matchMedia("(orientation: portrait)").matches) {
        sizeFactor = portraitSizeFactor
    }

    noTrainings.style.width = px(sizeFactor * min)
    noTrainings.style.height = px(sizeFactor * min)
}

// Temporary - activate od displaying
window.addEventListener("load", resizeNoTrainDisp)  // Is necessary?

new ResizeObserver(resizeNoTrainDisp).observe(trainingComponent)

// Sizing component
new ResizeObserver(sizeComponent).observe(trainingComponent)

function sizeComponent() {
    const height = float(getComputedStyle(trainingComponent).height)
    trainingComponent.style.fontSize = px(0.03*height + 4.78)
}


// Creating training parts
const trainingTempl = document.querySelector(".tc-training-template")
const groupTempl = document.querySelector(".tc-group-template")
const noGroupTemp = document.querySelector(".tc-no-group-template")

const exerciseTempl = document.querySelector(".tc-exercise-template")
const exerciseSetTempl = document.querySelector(".tc-exercise-set-template")
const notesTempl = document.querySelector(".tc-notes-template")

function createTrainingInfo(trainingName) {
    const tInfo = trainingTempl.content.cloneNode(true)
    const notesButton = tInfo.querySelector(".tct-notes-button")
    const notes = tInfo.querySelector(".tct-notes")

    // Heading
    const heading = tInfo.querySelector(".tct-heading")
    heading.textContent = trainingName

    // Notes display
    notesButton.addEventListener("click", () => {
        notesButton.style.display = "none"
        notes.style.display = "block"
        notes.focus()
    })

    // Notes sizing
    notes.addEventListener("input", sizeTrainingNotes)

    return tInfo
}

function createGroup(groupName) {
    const group = groupTempl.content.cloneNode(true)
    const groupCont = group.querySelector(".tcg-container")
    const notesButton = group.querySelector(".tcg-notes-button")
    const notes = group.querySelector(".tcg-notes")

    // Heading
    const heading = group.querySelector("h3")
    heading.textContent = groupName

    // Notes display
    notesButton.addEventListener("click", () => {
        notesButton.style.display = "none"
        notes.style.display = "block"
        setGroupWidth(groupCont)
        notes.focus()
    })

    // Notes sizing
    notes.addEventListener("input", sizeTrainingNotes)

    widthObserver.observe(groupCont)
    return [group, groupCont]
}

function createNoGroup() {
    const noGroup = noGroupTemp.content.cloneNode(true)
    const noGroupCont = noGroup.querySelector(".tc-no-group")

    widthObserver.observe(noGroupCont)

    return [noGroup, noGroupCont]
}

const widthObserver = new ResizeObserver(setGroupWidthObs)

function setGroupWidthObs(entries) {
    for (const {target} of entries) {
        setGroupWidth(target)
    }
}

function setGroupWidth(groupContainer) {
    let first = groupContainer.firstElementChild
    const last = groupContainer.lastElementChild

    // If first element isn't displayed
    if (getComputedStyle(first).display == "none") {
        first = first.nextElementSibling
    }

    let start = first.getBoundingClientRect().left
    start -= float(getComputedStyle(first).marginLeft)

    let end = last.getBoundingClientRect().right
    end += float(getComputedStyle(last).marginRight)

    groupContainer.style.width = px(end - start)
}

function createExercise(exerciseName, numOfSets) {
    const exercise = exerciseTempl.content.cloneNode(true)
    const heading = exercise.querySelector(".tce-name")
    const container = exercise.querySelector(".tce-container")

    const notesButton = exercise.querySelector(".tce-notes-button")
    const notesFrag = notesTempl.content.cloneNode(true)
    const notes = notesFrag.querySelector(".tc-notes")

    // Heading
    heading.textContent = exerciseName

    // Notes display
    notesButton.addEventListener("click", () => {
        // Display notes
        notesButton.style.display = "none"
        container.prepend(notesFrag)

        // Adjust containing group size
        const group = container.closest(".tcg-container, .tc-no-group")
        setGroupWidth(group)

        notes.focus()
    })

    // Notes sizing
    notes.addEventListener("input", sizeTrainingNotes)

    // Sets
    for (const _ of range(numOfSets)) {
        container.append(exerciseSetTempl.content.cloneNode(true))
    }

    return exercise
}

function sizeTrainingNotes(e) {
    sizeNotes(e)

    // Resize container
    const group = e.target.closest(".tcg-container, .tc-no-group")
    if (group) setGroupWidth(group)
}

// Temporary
const container = document.querySelector(".tc-container")

    // Adding training info, group and exercises to the document
window.addEventListener("load", () => {
    container.append(createTrainingInfo("Training Name"))

    const [group, groupCont] = createGroup("First Group")
    container.append(group)

    const [noGroup, noGroupCont] = createNoGroup()
    container.append(noGroup)

    for (const container of [groupCont, noGroupCont]) {
        for (const num of range(3)) {
            container.append(createExercise(`Exercise ${num+1}`, 3))
        }
    }

    // Activating running styles
    const runningGroup = document.querySelector(".tc-group")
    const runningExercise = document.querySelectorAll(".tc-exercise")[1]
    const runningSet = runningExercise.querySelectorAll(".tc-exercise-set")[1]

    const runningExercise2 = document.querySelectorAll(".tc-exercise")[2]
    const runningSet2 = runningExercise2.querySelectorAll(".tc-exercise-set")[1]

    for (const elem of [runningGroup, runningExercise]) {
        elem.classList.add("running")
    }

    runningSet.classList.add("running-set")
    runningSet2.classList.add("running-pause")
})

