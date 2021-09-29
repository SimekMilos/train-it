
import {range, waitForAny} from "../tools.js"
import * as display from "./display.js"
import * as create from "./create.js"
import {readTraining, ReadError} from "./read.js"

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
    if (trainingData) create.createTraining(trainingData)
    await display.display()

    // Edit cycle
    do {
        const save = await waitForAny(["click", buttonSave,   true],
                                      ["click", buttonCancel, false])
        // Saving training
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

        // Cancel edit
        } else {
            if (hasChanged(trainingData)) {
                finished = confirm("Do you want to delete unsaved changes?")
            } else {
                finished = true
            }
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


const scrollContainer = document.querySelector(".ts-scroll-container")
const addControls = document.querySelector(".ts-add-controls")
import {wait, float, dynamicScrollDown} from "../tools.js"


async function addGroup() {
    const group = create.appendToContainer(groupContainer, "group")

    // Get scroll distance
    let {top: groupTop} = group.getBoundingClientRect()
    let {bottom: cntrlsBottom} = addControls.getBoundingClientRect()
    cntrlsBottom += float(getComputedStyle(addControls).marginBottom)
    const scroll = create.computeScrollDist(groupTop - 10, cntrlsBottom)
                                            // 10px offset from top
    group.remove()

    // Scroll down
    let removePadd = null
    if (scroll) removePadd = await dynamicScrollDown(scroll, 250, scrollContainer)
    await wait(100)

    // Add group
    groupContainer.append(group)
    await create.displayAnim(group)

    if (removePadd) removePadd()
}

async function addExercise() {
    let last = groupContainer.lastElementChild

    // Creates no-group container if needed
    if (!last.classList.contains("ts-no-group")) {
        last.after(create.createGroup({type: "no-group"}))
        last = groupContainer.lastElementChild
    }

    // Append exercise
    const exercise = create.appendToContainer(last, "exercise")

    // Get scroll distance
    let {top: exerTop} = exercise.getBoundingClientRect()
    let   {bottom: cntrlsBottom} = addControls.getBoundingClientRect()
    cntrlsBottom += float(getComputedStyle(addControls).marginBottom)
    const scroll = create.computeScrollDist(exerTop - 10, cntrlsBottom)
                                            // 10px offset from top
    exercise.remove()

    // Scroll down
    let removePadd = null
    if (scroll) removePadd = await dynamicScrollDown(scroll, 250, scrollContainer)
    await wait(100)

    // Add exercise
    last.append(exercise)
    await create.displayAnim(exercise)

    if (removePadd) removePadd()
}

function hasChanged(originalTrainingData) {
    // Test when creating new training
    if (!originalTrainingData) {
        if (trainingName.value.trim()) return true
        if (trainingNotes.value.trim()) return true
        if (groupContainer.children.length > 1) return true

        return false
    }

    // Test when editing training
    // Get current data
    let current
    try {
        current = readTraining()
    } catch (err) {                    // ReadError == training has been edited
        if (err instanceof ReadError) return true
        else throw err
    }

    // Compare data sets
    return !areEqual(originalTrainingData, current)
}


// Data equality comparison

function areEqual(first, second) {
    if (first.name != second.name) return false
    if (first.notes != second.notes) return false

    // Compare groups
    const gr1 = first.groups, gr2 = second.groups
    if (gr1.length != gr2.length) return false

    for (const index of range(gr1.length)) {
        if (!groupsAreEqual(gr1[index], gr2[index])) return false
    }

    return true
}

function groupsAreEqual(first, second) {
    if (first.type != second.type) return false
    if (first.name != second.name) return false
    if (first.notes != second.notes) return false

    // Compare exercises
    const ex1 = first.exercises, ex2 = second.exercises
    if (ex1.length != ex2.length) return false

    for (const index of range(ex1.length)) {
        if (!exercisesAreEqual(ex1[index], ex2[index])) return false
    }

    return true
}

function exercisesAreEqual(first, second) {
    if (first.name != second.name) return false
    if (first.notes != second.notes) return false

    // Compare sets
    if (JSON.stringify(first.sets) != JSON.stringify(second.sets)) return false

    return true
}