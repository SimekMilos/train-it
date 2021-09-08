
import {px, float, range} from "./tools.js"

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
const exerciseSetTempl = document.querySelector(".tc-exercise-set-template")
const notesTempl = document.querySelector(".tc-notes-template")

function createTrainingInfo(trainingName) {
    const tInfo = trainingTempl.content.cloneNode(true)
    const heading = tInfo.querySelector("h2")
    heading.textContent = trainingName
    tInfo.firstElementChild.append(createNotes())

    return tInfo
}

function createGroup(groupName) {
    const group = groupTempl.content.cloneNode(true)
    const groupCont = group.querySelector(".tcg-container")
    const heading = group.querySelector("h3")

    heading.textContent = groupName
    groupCont.append(createNotes())

    widthObserver.observe(groupCont)

    return [group, groupCont]
}

function createNoGroup() {
    const noGroup = noGroupTemp.content.cloneNode(true)
    const noGroupCont = noGroup.querySelector(".tc-no-group")

    widthObserver.observe(noGroupCont)

    return [noGroup, noGroupCont]
}

const widthObserver = new ResizeObserver(setWidthObs)

function setWidthObs(entries) {
    for (const {target} of entries) {
        setWidth(target)
    }
}

function setWidth(elem) {
    const first = elem.firstElementChild
    const last = elem.lastElementChild

    let start = first.getBoundingClientRect().left
    start -= float(getComputedStyle(first).marginLeft)

    let end = last.getBoundingClientRect().right
    end += float(getComputedStyle(last).marginRight)

    elem.style.width = px(end - start)
}

function createExercise(exerciseName, displayNotes, numOfSets) {
    const exercise = document.createDocumentFragment()

    // Header
    const header = exerciseHeaderTempl.content.cloneNode(true)
    const heading = header.querySelector("h3")
    heading.textContent = exerciseName
    exercise.append(header)

    // Notes
    if (displayNotes) exercise.append(createNotes())

    // Sets
    for (const _ of range(numOfSets)) {
        exercise.append(exerciseSetTempl.content.cloneNode(true))
    }
    exercise.lastElementChild.classList.add("last")

    return exercise
}

function createNotes() {
    const notes = notesTempl.content.cloneNode(true)
    const button = notes.querySelector(".tcn-button")
    button.addEventListener("click", notesButtonClick)

    return notes
}

function notesButtonClick(e) {
    e.currentTarget.parentElement.classList.add("display")

    const group = e.currentTarget.closest(".tcg-container, .tc-no-group")
    if (group) setWidth(group)

    e.currentTarget.nextElementSibling.focus()
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
            container.append(createExercise(`Excercise ${num+1}`, true, 3))
        }
    }
})

