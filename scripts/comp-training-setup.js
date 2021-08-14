
// --- Temporary ---

const exerciseContainer = document.querySelector(".ts-exercise-container")
const groupTemplate = document.querySelector(".ts-group-template")
const exerciseTemplate = document.querySelector(".ts-exercise-template")
const setTemplate = document.querySelector(".ts-set-template")

// Creates group
const group = groupTemplate.content.cloneNode(true)
const grExerciseContainer = group.querySelector(".ts-group-exercise-container")

// Adds exercises to the group
for (const _ of [1, 2]) {
    const exercise = exerciseTemplate.content.cloneNode(true)
    grExerciseContainer.append(exercise)
}

// exerciseContainer.append(group)

// Adds separate exercise
const exercise = exerciseTemplate.content.cloneNode(true)
// exerciseContainer.append(exercise)