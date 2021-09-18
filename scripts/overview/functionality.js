
const trainingTemplate = document.querySelector(".ov-training-template")
const trainingList = document.querySelector(".ov-training-list")


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

    return training
}


// --- Displaying overview-settings ---

import * as overSettings from "../overview-settings/overview-settings.js"

const settingsButton = document.querySelector(".ov-settings")

async function onSettingsClick() {
    settingsButton.disabled = true

    if (!overSettings.isDisplayed()) await overSettings.display()
    else                             await overSettings.hide()

    settingsButton.disabled = false
}

settingsButton.addEventListener("click", onSettingsClick)