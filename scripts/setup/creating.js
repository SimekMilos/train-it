
import {range, sizeNotes} from "../tools.js"

const groupTemplate = document.querySelector(".ts-group-template")
const noGroupTemplate = document.querySelector(".ts-no-group-template")
const exerciseTemplate = document.querySelector(".ts-exercise-template")
const setTemplate = document.querySelector(".ts-set-template")

const trainingName = document.querySelector(".ts-training-name")
const trainingNotes = document.querySelector(".ts-training-notes")
const groupContainer = document.querySelector(".ts-group-container")

trainingNotes.addEventListener("input", sizeNotes)


export function createTraining(data) {
   trainingName.value = data.name
   trainingNotes.textContent = data.notes

   for (const group of data.groups) {
      groupContainer.append(createGroup(group))
   }
}

export function createGroup(data = null) {
   /* Both for groups and no-groups
      Input - group object/null (empty group)
   */

   if (!data) data = {type: "group"}

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

export function createExcercise(data = null) {
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