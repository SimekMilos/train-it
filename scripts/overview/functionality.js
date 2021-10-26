
import {float, range, wait, waitFor, dialog, generateTrainingID} from "../tools.js"
import {storageVersion} from "../main.js"

import {smoothScroll, addDynamicPadding} from "../scrolling.js"
import {getExtraContainerHeight} from "../scrolling.js"

import * as screens from "../screens.js"
import * as overviewSettings from "../overview-settings/overview-settings.js"
import * as setup from "../setup/setup.js"

import * as display from "./display.js"

const initialScreen = document.querySelector(".initial-screen")
const verticalContainer = document.querySelector(".vertical-container")
const trainingList = document.querySelector(".ov-training-list")
const trainingTemplate = document.querySelector(".ov-training-template")

const buttonOpenTimer = document.querySelector(".ov-open-timer")
const buttonOpenTraining = document.querySelector(".ov-open-training")
const buttonDelete = document.querySelector(".ov-delete")
const buttonCreate = document.querySelector(".ov-create")
const buttonEdit = document.querySelector(".ov-edit")
const buttonSettings = document.querySelector(".ov-settings")

const storage = localStorage


// --- Loading trainings ---

export function loadTrainings() {
    let order = storage.getItem("training-order")
    if (!order) return

    // Delete current trainings from list (if there are any)
    for (const _ of range(1, trainingList.children.length)) {
        trainingList.children[1].remove()
    }

    order = JSON.parse(order)
    const trainings = document.createDocumentFragment()

    for (const trainingID of order) {
        const training = JSON.parse(storage.getItem(trainingID))
        trainings.append(createTrainingItem(trainingID, training.name))
    }

    trainingList.append(trainings)
}


// --- Training selection ---

initialScreen.addEventListener("click", detectDeselection)

function detectDeselection(event) {
    /* Deselection applies when:
        - clicked outside of component
        - clicked within component but not on any controls
    */

    const target = event.target

    if (display.isDisabled()) return
    if (target.closest(".ov-training")) return
    if (target.closest(".ov-controls")) return

    if (target == initialScreen ||
        target == verticalContainer ||
        target.closest(".overview-component")) {

        deselectedMode()
    }
}

function selectedMode() {
    buttonOpenTraining.style.display = "block"
    buttonEdit.style.display = "block"

    buttonOpenTimer.style.display = "none"
    buttonCreate.style.display = "none"

    buttonDelete.disabled = false
}

function deselectedMode(uncheck = true) {
    buttonOpenTraining.style.display = "none"
    buttonEdit.style.display = "none"

    buttonOpenTimer.style.display = "block"
    buttonCreate.style.display = "block"

    buttonDelete.disabled = true

    // unchecks selected training
    if (!uncheck) return
    const trItems = trainingList.querySelectorAll(":scope [name=\"training\"]")
    for (const trItem of trItems) trItem.checked = false
}


// --- Create/Edit Training ---

buttonCreate.addEventListener("click", createTraining)
buttonEdit.addEventListener("click", editTraining)

async function createTraining() {
    if (overviewSettings.isDisplayed()) overviewSettings.hide()

    const trData = await setup.setupTraining()
    if (!trData) return

    const trID = generateTrainingID()

    // Add training in storage order array
    let orderArr = JSON.parse(storage.getItem("training-order"))
    if (!orderArr) orderArr = []
    orderArr.push(trID)
    storage.setItem("training-order", JSON.stringify(orderArr))

    // Save training data
    storage.setItem(trID, JSON.stringify(trData))
    if (!storage.getItem("storage-version")) {
        storage.setItem("storage-version", storageVersion)
    }

    // Create training item
    const trList = trainingList
    const trItem = createTrainingItem(trID, trData.name).firstElementChild

    // Get scroll distance
    trList.append(trItem)
    let distance = trItem.getBoundingClientRect().bottom
                   - trList.getBoundingClientRect().bottom
    trItem.remove()

    // Scroll container
    let removePadd = null
    if (distance > 0) {
        distance += getExtraContainerHeight(trList)
        removePadd = addDynamicPadding(distance, trList)
        await smoothScroll(distance, 100, trList)
    }
    await wait(200)

    // Setup training item
    trItem.classList.add("hidden")
    trList.append(trItem)
    await wait(0)           // to kick start transition

    // Transition training item
    trItem.classList.remove("hidden")
    await waitFor("transitionend", trItem)
    if (removePadd) removePadd()
}

async function editTraining() {
    if (overviewSettings.isDisplayed()) overviewSettings.hide()

    // Get selected training
    let {trID, trData, trNameElem} = getSelectedTraining()

    // Edit training
    trData = await setup.setupTraining(trData)
    if (!trData) return

    // Save training data
    storage.setItem(trID, JSON.stringify(trData))

    // Edit text in training item
    trNameElem.textContent = trData.name
}


// --- Delete Training ---

buttonDelete.addEventListener("click", deleteTraining)

async function deleteTraining() {
    const {trElem, trNameElem, trID} = getSelectedTraining()

    // Confirm deletion
    const trName = trNameElem.textContent
    const action = await dialog(`Do you want to delete training: ${trName}?`,
                                "Yes", "No")
    if (action == "No") return
    display.disableAccess()

    // Delete element and scroll up
    await wait(200)
    trElem.classList.add("hidden")

    let remPadd = null
    const itemHeight = float(getComputedStyle(trElem).height)
    if (trainingList.scrollHeight > trainingList.clientHeight) {
        remPadd = addDynamicPadding(itemHeight, trainingList)
    }

    waitFor("transitionend", trElem).then(async () => {
        trElem.remove()
        deselectedMode(false)
        display.enableAccess()

        await wait(200)
        if (remPadd) remPadd(250)
    })

    // Delete training from storage order list
    let orderArr = JSON.parse(storage.getItem("training-order"))
    orderArr = orderArr.filter(id => id != trID)

    if (orderArr.length) {
        storage.setItem("training-order", JSON.stringify(orderArr))
    } else {
        storage.removeItem("training-order")
        storage.removeItem("storage-version")
    }

    // Delete training data
    storage.removeItem(trID)
    overviewSettings.onStorageRemove()  // notify component about removal
}


// --- Drag & Drop ---

let draggedElem = null
let dropZone = null

async function dragStart(ev) {
    ev.dataTransfer.setData('text/plain', null)
    ev.dataTransfer.effectAllowed = "move"

    draggedElem = ev.target
    draggedElem.classList.add("drag")
    draggedElem.style.opacity = ".5"

    dropZone = createDropZone()
    draggedElem.after(dropZone)

    await wait(0)
    draggedElem.remove()
}

async function dragEnter(ev) {
    const elem = ev.currentTarget
    let listItems = trainingList.children
    let elemIndex, dropZoneIndex

    // Get positions of elem and dropzone
    for(const index of range(1, listItems.length)) {
        if (listItems[index] == elem) elemIndex = index
        if (listItems[index].classList.contains("ov-drop-zone")) {
            dropZoneIndex = index
        }
    }

    // Add new dropzone
    dropZone.remove()
    dropZone = createDropZone()
    if (dropZoneIndex > elemIndex) elem.before(dropZone)
    else                           elem.after(dropZone)
}

function dragEnd(ev) {
    ev.target.style.removeProperty("opacity")
    ev.target.classList.remove("drag")

    // Drop canceled
    if (ev.dataTransfer.dropEffect == "none") {
        dropZone.remove()
        loadTrainings()
    }
}

function createDropZone() {
    const dropZone = document.createElement("div")
    dropZone.classList.add("ov-drop-zone")

    // Dropping
    dropZone.addEventListener("dragover", ev => {
        ev.preventDefault()
        ev.dataTransfer.dropEffect = "move"
    })

    dropZone.addEventListener("drop", ev => {
        ev.preventDefault()

        ev.target.after(draggedElem)
        ev.target.remove()
        storeDropChange()
    })

    return dropZone
}

function storeDropChange() {
    const trainings = [...trainingList.children]
    trainings.shift()               // Ignoring no-training display

    const newOrder = []
    for(const training of trainings) newOrder.push(training.firstElementChild.id)
    storage["training-order"] = JSON.stringify(newOrder)
}


// --- Open Training/Timer ---

buttonOpenTraining.addEventListener("click", openTraining)
buttonOpenTimer.addEventListener("click", openTimer)

async function openTraining() {
    await hideComponents()
    const trInfo = getSelectedTraining()

    // Append store function
    trInfo.trData.store = function() {
        storage[trInfo.trID] = JSON.stringify(this)
    }

    screens.transitionToMainScreen(trInfo.trData)
}

async function openTimer() {
    await hideComponents()
    screens.transitionToMainScreen(null)
}

async function hideComponents() {
    display.disableAccess()

    // Hide overview settings
    if (overviewSettings.isDisplayed()) {
        overviewSettings.hide()
        await wait(100)
    }
    await wait(100)

    // Hide overview
    await display.hide()
}


// --- Display settings ---

buttonSettings.addEventListener("click", onSettingsClick)

async function onSettingsClick() {
    display.settingsButtonDisabling(true)

    if (!overviewSettings.isDisplayed()) await overviewSettings.display()
    else                                 await overviewSettings.hide()

    display.settingsButtonDisabling(false)
}


// --- Other ---

function createTrainingItem(trainingID, trainingName) {
    const trainingFrag = trainingTemplate.content.cloneNode(true)

    const training = trainingFrag.querySelector(".ov-training")
    const input = trainingFrag.querySelector("input")
    const label = trainingFrag.querySelector("label")
    const name = trainingFrag.querySelector(".ovt-name")

    input.id = trainingID
    label.htmlFor = trainingID
    name.textContent = trainingName

    label.addEventListener("click", selectedMode)
    training.addEventListener("dragstart", dragStart)
    training.addEventListener("dragenter", dragEnter)
    training.addEventListener("dragend", dragEnd)

    return trainingFrag
}

function getSelectedTraining() {
    // Find active input
    let trainings = trainingList.querySelectorAll(":scope [name=\"training\"]")
    trainings = Array.from(trainings)
    let input = trainings.find(value => value.checked)

    // Gather training info
    const trElem = input.parentElement
    const trNameElem = trElem.querySelector(":scope .ovt-name")
    const trID = input.id
    const trData = JSON.parse(storage.getItem(trID))

    return {
        trElem: trElem,
        trNameElem: trNameElem,
        trID: trID,
        trData: trData
    }
}