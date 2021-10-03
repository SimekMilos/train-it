
import {px, float, wait, waitFor, generateTrainingID} from "../tools.js"

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
    if (!orderArr) orderArr = new Array
    orderArr.push(trID)
    storage.setItem("training-order", JSON.stringify(orderArr))

    // Save trainind data
    storage.setItem(trID, JSON.stringify(trData))

    // Scroll container
    const tList = trainingList
    if (tList.scrollTop + tList.clientHeight < tList.scrollHeight) {
        await smoothScrollDown(tList, 100)
    }
    await wait(100)

    // Display training item
    const trItem = createTrainingItem(trID, trData.name)
    const itemElem = trItem.firstElementChild
    itemElem.classList.add("hidden")
    trainingList.append(trItem)

    await wait(0)       // to kick start transition
    itemElem.classList.remove("hidden")
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

async function smoothScrollDown(elem, duration) {
    const diff = elem.scrollHeight - elem.scrollTop - elem.clientHeight
    const step = 8*diff/duration
    let scrolled = elem.scrollTop

    while (scrolled + elem.clientHeight < elem.scrollHeight) {
        scrolled += step
        elem.scroll({top: scrolled})
        await wait(8)               // 120 fps
    }

    elem.scroll({top: elem.scrollHeight - elem.clientHeight})
}


// --- Delete Training ---

buttonDelete.addEventListener("click", deleteTraining)

async function deleteTraining() {
    const {trElem, trNameElem, trID} = getSelectedTraining()

    // Confirm deletion
    const trName = trNameElem.textContent
    if (!window.confirm(`Do you want to delete training - ${trName}?`)) return
    display.disableAccess()

    // Delete element and scroll up
    await wait(200)
    trElem.classList.add("hidden")

    const itemHeight = float(getComputedStyle(trElem).height)
    if (trainingList.scrollHeight > trainingList.clientHeight) {
        trainingList.style.paddingBottom = px(itemHeight)
    }

    waitFor("transitionend", trElem).then(async () => {
        trElem.remove()
        deselectedMode(false)
        display.enableAccess()

        await wait(200)
        if (trainingList.style.paddingBottom) {
            smoothRemoveBottomPadding(trainingList, itemHeight, 250)
        }
    })

    // Delete training from storage order list
    let orderArr = JSON.parse(storage.getItem("training-order"))
    orderArr = orderArr.filter(id => id != trID)

    if (orderArr.length) {
        storage.setItem("training-order", JSON.stringify(orderArr))
    } else {
        storage.removeItem("training-order")
    }

    // Delete training data
    storage.removeItem(trID)
    overviewSettings.onStorageRemove()  // notify component about removal
}

async function smoothRemoveBottomPadding(elem, amount, duration) {
    const step = 8*amount/duration

    while (amount > 0) {
        amount -= step
        elem.style.paddingBottom = px(amount)
        await wait(8)                           // 120 fps
    }
    elem.style.removeProperty("padding-bottom")
}


// --- Open Training/Timer ---

buttonOpenTraining.addEventListener("click", openTraining)
buttonOpenTimer.addEventListener("click", openTimer)

async function openTraining() {
    await hideComponents()
    screens.transitionToMainScreen(getSelectedTraining().trData)
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
    const training = trainingTemplate.content.cloneNode(true)

    const input = training.querySelector("input")
    const label = training.querySelector("label")
    const name = training.querySelector(".ovt-name")

    input.id = trainingID
    label.htmlFor = trainingID
    name.textContent = trainingName

    label.addEventListener("click", selectedMode)

    return training
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