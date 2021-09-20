
import {settingsButtonDisable} from "./display.js"
import * as overviewSettings from "../overview-settings/overview-settings.js"

const trainingTemplate = document.querySelector(".ov-training-template")
const trainingList = document.querySelector(".ov-training-list")
const settingsButton = document.querySelector(".ov-settings")


// --- Loading trainings ---

export function loadTrainings() {
    const storage = window.localStorage

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

    label.addEventListener("click", trainingSelectedMode)

    return training
}


// --- Displaying overview-settings ---

async function onSettingsClick() {
    settingsButtonDisable(true)

    if (!overviewSettings.isDisplayed()) await overviewSettings.display()
    else                                 await overviewSettings.hide()

    settingsButtonDisable(false)
}

settingsButton.addEventListener("click", onSettingsClick)


// --- Training select ---

const openTimerButton = document.querySelector(".ov-open-timer")
const openTrainingButton = document.querySelector(".ov-open-training")
const createButton = document.querySelector(".ov-create")
const editButton = document.querySelector(".ov-edit")
const deleteButton = document.querySelector(".ov-delete")


function trainingSelectedMode() {
    openTrainingButton.style.display = "block"
    editButton.style.display = "block"

    openTimerButton.style.display = "none"
    createButton.style.display = "none"

    deleteButton.disabled = false
}

function trainingDeselectedMode() {
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




// Temporary
// Creating data in local storage
import {range} from "../tools.js"

(() => {
    const storage = localStorage

    storage.setItem("training-order",
        JSON.stringify(["training-3", "training-2", "training-1"]))

    for (const num of range(1,4)) {
        storage.setItem(`training-${num}`,
            JSON.stringify({name: `Training ${num}`}))
    }
})()