
import {range, waitFor} from "../tools.js"
import * as display from "./display.js"

const buttonCancel = document.querySelector(".ts-cancel")



export async function setupTraining(oldTraining = null) {
   /* Main component function to create/edit training

      oldTraining - training data object/null
      return - Promise of training object/null
   */

   display.display()

   await waitFor("click", buttonCancel)

   display.hide()

   return null
}



function createTraining(trainingData) {

}

function readTraining(component) {

}


function createGroup(groupData) {
   /* Both for groups and no-groups */

}

function readGroup(groupElem) {
   /* Both for groups and no-groups */

}


function createExcercise(data) {
   /* Input - excercise object/null (empty excercise) */

}

function readExcercise(excerciseElem) {

}
}