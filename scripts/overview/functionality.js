
import {px, float, range, wait} from "../tools.js"

import * as display from "./display.js"
import * as overviewSettings from "../overview-settings/overview-settings.js"

const trainingTemplate = document.querySelector(".ov-training-template")
const trainingList = document.querySelector(".ov-training-list")
const settingsButton = document.querySelector(".ov-settings")

const storage = window.localStorage


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


// --- Displaying overview-settings ---

async function onSettingsClick() {
    display.settingsButtonDisable(true)

    if (!overviewSettings.isDisplayed()) await overviewSettings.display()
    else                                 await overviewSettings.hide()

    display.settingsButtonDisable(false)
}

settingsButton.addEventListener("click", onSettingsClick)


// --- Training select ---

const initialScreen = document.querySelector(".initial-screen")
const verticalContainer = document.querySelector(".vertical-container")

const openTimerButton = document.querySelector(".ov-open-timer")
const openTrainingButton = document.querySelector(".ov-open-training")
const createButton = document.querySelector(".ov-create")
const editButton = document.querySelector(".ov-edit")
const deleteButton = document.querySelector(".ov-delete")


function selectedMode() {
    openTrainingButton.style.display = "block"
    editButton.style.display = "block"

    openTimerButton.style.display = "none"
    createButton.style.display = "none"

    deleteButton.disabled = false
}

function deselectedMode(uncheck = true) {
    openTrainingButton.style.display = "none"
    editButton.style.display = "none"

    openTimerButton.style.display = "block"
    createButton.style.display = "block"

    deleteButton.disabled = true

    // unchecks selected training
    if (!uncheck) return
    const trItems = trainingList.querySelectorAll(":scope [name=\"training\"]")
    for (const trItem of trItems) trItem.checked = false
}

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

initialScreen.addEventListener("click", detectDeselection)


// --- Deleting Training ---

async function deleteTraining() {
    // find selected training
    let trainings = trainingList.querySelectorAll(":scope [name=\"training\"]")
    trainings = Array.from(trainings)
    let training = trainings.find(value => value.checked)
    training = training.parentElement

    // confirm deletion
    const trName = training.querySelector(":scope .ovt-name").textContent
    if (!window.confirm(`Do you want to delete training - ${trName}?`)) return
    deselectedMode(false)

    // delete element and scroll up
    await wait(200)
    training.classList.add("hidden")

    const itemHeight = float(getComputedStyle(training).height)
    if (trainingList.scrollHeight > trainingList.clientHeight) {
        trainingList.style.paddingBottom = px(itemHeight)
    }

    training.addEventListener("transitionend", async () => {
        training.remove()
        await wait(200)
        if (trainingList.style.paddingBottom) {
            smoothRemoveBottomPadding(trainingList, itemHeight, 250)
        }
    })

    // delete training from order list
    const deleteID = training.firstElementChild.id
    let orderArr = JSON.parse(storage.getItem("training-order"))
    orderArr = orderArr.filter(id => id != deleteID)

    if (orderArr.length) {
        storage.setItem("training-order", JSON.stringify(orderArr))
    } else {
        storage.removeItem("training-order")
    }

    // delete training data
    storage.removeItem(deleteID)
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

deleteButton.addEventListener("click", deleteTraining)


// --- Create/Edit Training ---

import * as setup from "../setup/setup.js"

async function createTraining() {
    const training = await setup.setupTraining()
    if (!training) return

    const trID = generateTrainingID()

    // add training in storage order array
    let orderArr = JSON.parse(storage.getItem("training-order"))
    if (!orderArr) orderArr = new Array
    orderArr.push(trID)
    storage.setItem("training-order", JSON.stringify(orderArr))

    // save trainind data
    storage.setItem(trID, JSON.stringify(training))

    // scroll container
    const tList = trainingList
    if (tList.scrollTop + tList.clientHeight < tList.scrollHeight) {
        await smoothScrollDown(tList, 100)
    }
    await wait(100)

    // display training item
    const trItem = createTrainingItem(trID, training.name)
    const itemElem = trItem.firstElementChild
    itemElem.classList.add("hidden")

    trainingList.append(trItem)
    setTimeout(() => itemElem.classList.remove("hidden"), 0)
}

async function editTraining() {

}

function generateTrainingID() {
    for(const count of range(1, Infinity)) {
        const ID = `training-${count}`
        if (!storage.getItem(ID)) return ID
    }
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

createButton.addEventListener("click", createTraining)
editButton.addEventListener("click", editTraining)



// Temporary
// Creating data in local storage

;(() => {
    storage.clear()
    storage.setItem("training-order",
        JSON.stringify(["training-2", "training-1"]))

    for (const num of range(1,3)) {
        storage.setItem(`training-${num}`,
            JSON.stringify({name: `Training ${num}`}))
    }
})()