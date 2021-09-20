
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

function deselectedMode() {
    // deselect selected training
    for (const trItem of trainingList.querySelectorAll(":scope [name=\"training\"]")) {
        trItem.checked = false
    }

    openTrainingButton.style.display = "none"
    editButton.style.display = "none"

    openTimerButton.style.display = "block"
    createButton.style.display = "block"

    deleteButton.disabled = true
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

function deleteTraining() {
    // confirm deletion
    if (!window.confirm("Do you want to delete selected training?")) return

    // find selected training
    let training = trainingList.querySelectorAll(":scope [name=\"training\"]")
    training = Array.from(training)
    training = training.find(value => value.checked)
    training = training.parentElement

    // delete element
    training.classList.add("hidden")
    training.addEventListener("transitionend", () => training.remove())

    // delete training id from order list
    const deleteID = training.firstElementChild.id

    let orderArr = JSON.parse(storage.getItem("training-order"))
    orderArr = orderArr.filter(id => id != deleteID)

    if (orderArr.length) {
        storage.setItem("training-order", JSON.stringify(orderArr))
    } else {
        storage.removeItem("training-order")
    }

    // delete training
    storage.removeItem(deleteID)
}

deleteButton.addEventListener("click", deleteTraining)




// Temporary
// Creating data in local storage
import {range} from "../tools.js"

(() => {
    storage.setItem("training-order",
        JSON.stringify(["training-3", "training-2", "training-1"]))

    for (const num of range(1,4)) {
        storage.setItem(`training-${num}`,
            JSON.stringify({name: `Training ${num}`}))
    }
})()