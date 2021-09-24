
import {waitForAny} from "../tools.js"
import * as display from "./display.js"
import {createTraining, createGroup, createExercise} from "./creating.js"
import {readTraining, ReadError} from "./reading.js"

const trainingName = document.querySelector(".ts-training-name")
const trainingNotes = document.querySelector(".ts-training-notes")
const groupContainer = document.querySelector(".ts-group-container")

const buttonAddGroup = document.querySelector(".ts-add-group")
const buttonAddExercise = document.querySelector(".ts-add-exercise")
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
    trainingNotes.value = ""

    let groups = Array.from(groupContainer.children)
    groups = groups.slice(1)         // not first element (no-exercise display)
    for (const group of groups) group.remove()

    return returnData
}


// --- Private ---

buttonAddGroup.addEventListener("click", addGroup)
buttonAddExercise.addEventListener("click", addExercise)

function addGroup() {
    groupContainer.append(createGroup())
}

function addExercise() {
    const last = groupContainer.lastElementChild

    // Appends exercise
    if (last.classList.contains("ts-no-group")) {
        last.append(createExercise())

    // Creates no-group container if needed (with 1 exercise)
    } else {
        last.after(createGroup({type: "no-group", exercises: [null]}))
    }
}