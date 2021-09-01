
import {px, range} from "./tools.js"

// No training display sizing and positioning

const mainScreen = document.querySelector(".main-screen")
const watchComponent = document.querySelector(".stopwatch-component")
const trainingComponent = document.querySelector(".training-component")
const noTrainings = document.querySelector(".tc-no-training")

const landscapeSizeFactor = 1
const portraitSizeFactor = .8

function onResize() {
    // Positioning
    const screenHeight = mainScreen.getBoundingClientRect().height
    const watchHeight = watchComponent.getBoundingClientRect().height
    const top = (screenHeight + watchHeight) / 2
    noTrainings.style.top = px(top)

    // Sizing
    const {width, height} = trainingComponent.getBoundingClientRect()
    const min = Math.min(width, height)

    let sizeFactor = landscapeSizeFactor
    if (matchMedia("(orientation: portrait)").matches) {
        sizeFactor = portraitSizeFactor
    }

    noTrainings.style.width = px(sizeFactor * min)
    noTrainings.style.height = px(sizeFactor * min)
}

// Temporary - activate od displaying
window.addEventListener("load", onResize)

new ResizeObserver(onResize).observe(trainingComponent)


// Creating training parts
const trainingTempl = document.querySelector(".tc-training-template")
const groupTempl = document.querySelector(".tc-group-template")
const noGroupTemp = document.querySelector(".tc-no-group-template")

const exerciseHeaderTempl = document.querySelector(".tc-exercise-header-template")
const exerciseNotesTempl = document.querySelector(".tc-exercise-notes-template")
const exerciseSetTempl = document.querySelector(".tc-exercise-set-template")

function createTrainingInfo(trainingName) {
    const tInfo = trainingTempl.content.cloneNode(true)
    const heading = tInfo.querySelector("h2")
    heading.textContent = trainingName

    return tInfo
}

function createGroup(groupName) {
    const group = groupTempl.content.cloneNode(true)
    const groupCont = group.querySelector(".tcg-container")
    const heading = group.querySelector("h3")
    heading.textContent = groupName

    return [group, groupCont]
}

function createNoGroup() {
    const noGroup = noGroupTemp.content.cloneNode(true)
    const noGroupCont = noGroup.querySelector(".tc-no-group")

    return [noGroup, noGroupCont]
}

function createExercise(exerciseName, displayNotes, numOfSets) {
    const exercise = document.createDocumentFragment()

    // Header
    const header = exerciseHeaderTempl.content.cloneNode(true)
    const heading = header.querySelector("h3")
    heading.textContent = exerciseName
    exercise.append(header)

    // Notes
    if (displayNotes) exercise.append(exerciseNotesTempl.content.cloneNode(true))

    // Sets
    for (const _ of range(numOfSets)) {
        exercise.append(exerciseSetTempl.content.cloneNode(true))
    }

    return exercise
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
            container.append(createExercise(`Excercise ${num}`, true, 3))
        }
    }

})

