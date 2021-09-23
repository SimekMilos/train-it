
import {waitForAny} from "../tools.js"
import * as display from "./display.js"
import {createTraining} from "./creating.js"

const trainingName = document.querySelector(".ts-training-name")
const trainingNotes = document.querySelector(".ts-training-notes")
const groupContainer = document.querySelector(".ts-group-container")

const buttonCancel = document.querySelector(".ts-cancel")
const buttonSave = document.querySelector(".ts-save")


export async function setupTraining(trainingData = null) {
   /* Main component function to create/edit training

      trainingData - training data object/null
      return - Promise of training object/null
   */

   let returnData = null

   if (trainingData) createTraining(trainingData)
   display.display()

   const save = await waitForAny(["click", buttonSave,   true],
                                 ["click", buttonCancel, false])

   if (save) {
      // read and validate data
      // save to returnData
   }
   // if invalid data, waitForAny again

   await display.hide()

   // Delete visual content
   trainingName.value = ""
   trainingNotes.textContent = ""

   let groups = Array.from(groupContainer.children)
   groups = groups.slice(1)         // not first element - no-excercise display
   for (const group of groups) group.remove()

   return returnData
}



// --- Temporary ---



const exData = {
   name: "ahoj",notes: "value", sets: [null, "ahoj", null, null, "nazdar"]
}


// adding empty group
const g1 = {type: "group"}

// adding group with data
const g2 ={
   type: "group",
   notes: "hello everyone",excercises: [exData, exData, null],
}


// adding no-group with data
const g3 = {
   type: "no-group",
   excercises: [exData, null, exData]
}

createTraining({
   name: "new training",
   notes: "test of notes",
   groups: [g1, g2, g3]
})
