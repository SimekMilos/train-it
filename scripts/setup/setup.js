
import {waitForAny} from "../tools.js"
import * as display from "./display.js"
import {createTraining} from "./creating.js"


const buttonCancel = document.querySelector(".ts-cancel")
const buttonSave = document.querySelector(".ts-save")


export async function setupTraining(trainingData = null) {
   /* Main component function to create/edit training

      trainingData - training data object/null
      return - Promise of training object/null
   */

   if (trainingData) createTraining(trainingData)
   display.display()

   const action = await waitForAny(["click", buttonCancel, "cancel"],
                                   ["click", buttonSave,   "save"])

   display.hide()

   return null
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
