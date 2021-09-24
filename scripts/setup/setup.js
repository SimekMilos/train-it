
import {waitForAny} from "../tools.js"
import * as display from "./display.js"
import {createTraining, createGroup, createExcercise} from "./creating.js"
import {readTraining, ReadError} from "./reading.js"

const trainingName = document.querySelector(".ts-training-name")
const trainingNotes = document.querySelector(".ts-training-notes")
const groupContainer = document.querySelector(".ts-group-container")

const buttonAddGroup = document.querySelector(".ts-add-group")
const buttonAddExcercise = document.querySelector(".ts-add-exercise")
const buttonCancel = document.querySelector(".ts-cancel")
const buttonSave = document.querySelector(".ts-save")


export async function setupTraining(trainingData = null) {
    /* Main component function to create/edit training

      trainingData - training data object/null
      return - Promise of training object/null
    */

    let returnData = null
    let finished = false

    // Display component
    if (trainingData) createTraining(trainingData)
    await display.display()

    // Edit cycle
    do {
        const save = await waitForAny(["click", buttonSave,   true],
                                      ["click", buttonCancel, false])

        if (save) {
            finished = true
            try {
                returnData = readTraining()

                // Copy training settings
                if (trainingData && trainingData.settings) {
                    returnData.settings = trainingData.settings
                }

            // Inform about incorrect format
            } catch (error) {
                if (error instanceof ReadError) {
                    finished = false
                    alert(error.message)
                } else throw error
            }
        } else {
            finished = true
            // warning before closing would require detecting change in data
            // which would need comparing original data to new data
            // settings in data should be ignored in comparison
        }
    } while(!finished)

    // Hide component
    await display.hide()

    // Delete visual content
    trainingName.value = ""
    trainingNotes.textContent = ""

    let groups = Array.from(groupContainer.children)
    groups = groups.slice(1)         // not first element (no-excercise display)
    for (const group of groups) group.remove()

    return returnData
}


// --- Private ---

buttonAddGroup.addEventListener("click", addGroup)
buttonAddExcercise.addEventListener("click", addExcercise)

function addGroup() {
    groupContainer.append(createGroup())
}

function addExcercise() {
    const last = groupContainer.lastElementChild

    // Appends excercise
    if (last.classList.contains("ts-no-group")) {
        last.append(createExcercise())

    // Creates no-group container if needed (with 1 excercise)
    } else {
        last.after(createGroup({type: "no-group", excercises: [null]}))
    }
}