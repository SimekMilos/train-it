
import {range, waitFor} from "../tools.js"
import * as display from "./display.js"


const groupTemplate = document.querySelector(".ts-group-template")
const noGroupTemplate = document.querySelector(".ts-no-group-template")
const exerciseTemplate = document.querySelector(".ts-exercise-template")
const setTemplate = document.querySelector(".ts-set-template")


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

   const exercise = exerciseTemplate.content.cloneNode(true)
   const name = exercise.querySelector(".ts-exercise-name")
   const notes = exercise.querySelector(".ts-exercise-notes")
   const setContainer = exercise.querySelector(".ts-exercise-set-container")

   // Setup excercise
   if (data) {
      name.value = data.name
      notes.textContent = data.notes

      // Setup sets
      for (const setName of data.sets) {
         const set = setTemplate.content.cloneNode(true)

         if (setName) {
            const nameElem = set.querySelector(".ts-set-name")
            nameElem.value = setName
         }
         setContainer.append(set)
      }

   // Default
   } else {
      for (const _ of range(3)) {
         setContainer.append(setTemplate.content.cloneNode(true))
      }
   }

   return exercise
}

function readExcercise(excerciseElem) {

}
}