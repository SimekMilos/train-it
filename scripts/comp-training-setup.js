
const scrollContainer = document.querySelector(".ts-scroll-container")
const exerciseContainer = document.querySelector(".ts-exercise-container")


// Sticky line effect

let lineHidden = true
function onScroll() {
    if (lineHidden) {
        if (scrollContainer.scrollTop >= exerciseContainer.offsetTop) {
            scrollContainer.style.borderTopColor = "var(--main-color)"
            lineHidden = false
        }
    } else {
        if (scrollContainer.scrollTop < exerciseContainer.offsetTop) {
            scrollContainer.style.removeProperty("border-top-color")
            lineHidden = true
        }
    }
}

scrollContainer.addEventListener("scroll", onScroll)




// --- Temporary ---

const groupTemplate = document.querySelector(".ts-group-template")
const exerciseTemplate = document.querySelector(".ts-exercise-template")
const setTemplate = document.querySelector(".ts-set-template")

// Creates group
const group = groupTemplate.content.cloneNode(true)
const grExerciseContainer = group.querySelector(".ts-group-exercise-container")

// Adds exercises to the group
for (const _ of [1, 2]) {
    const exercise = exerciseTemplate.content.cloneNode(true)
    // grExerciseContainer.append(exercise)
}

exerciseContainer.append(group)

// Adds separate exercise
const exercise = exerciseTemplate.content.cloneNode(true)
// exerciseContainer.append(exercise)