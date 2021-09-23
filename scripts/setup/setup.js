
import {range, waitFor, sizeNotes} from "../tools.js"
import * as display from "./display.js"


const groupTemplate = document.querySelector(".ts-group-template")
const noGroupTemplate = document.querySelector(".ts-no-group-template")
const exerciseTemplate = document.querySelector(".ts-exercise-template")
const setTemplate = document.querySelector(".ts-set-template")

const buttonCancel = document.querySelector(".ts-cancel")


export async function setupTraining(trainingData = null) {
   /* Main component function to create/edit training

      trainingData - training data object/null
      return - Promise of training object/null
   */

   if (trainingData) createTraining(trainingData)
   display.display()

   await waitFor("click", buttonCancel)

   display.hide()

   return null
}


const trainingName = document.querySelector(".ts-training-name")
const trainingNotes = document.querySelector(".ts-training-notes")
const groupContainer = document.querySelector(".ts-group-container")

trainingNotes.addEventListener("input", sizeNotes)

function createTraining(data) {
   trainingName.value = data.name
   trainingNotes.textContent = data.notes

   for (const group of data.groups) {
      groupContainer.append(createGroup(group))
   }
}

function readTraining() {

}


function createGroup(data) {
   /* Both for groups and no-groups
      Input - group object
         - Empty group - input needs to have .type
   */

   let group
   let exerciseContainer

   // Sets up group header
   if (data.type == "group") {
      group = groupTemplate.content.cloneNode(true)
      exerciseContainer = group.querySelector(".ts-group-exercise-container")

      const name = group.querySelector(".ts-group-name")
      const notes = group.querySelector(".ts-group-notes")
      notes.addEventListener("input", sizeNotes)

      // Load data
      if (data.name) {
         name.value = data.name
         notes.textContent = data.notes
      }

   // Sets up no-group
   } else {
      group = noGroupTemplate.content.cloneNode(true)
      exerciseContainer = group.querySelector(".ts-no-group")
   }

   // Add excercises
   if (data.excercises) {
      for (const excercise of data.excercises) {
         exerciseContainer.append(createExcercise(excercise))
      }
   }

   return group
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

   notes.addEventListener("input", sizeNotes)

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
