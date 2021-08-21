
const initialScreen = document.querySelector(".initial-screen")
const ovComponent = document.querySelector(".overview-component")

const tsContainer = document.querySelector(".ts-container")
const tsContainerStyles = window.getComputedStyle(tsContainer)

const tsComponent = tsContainer.firstElementChild
const tsClassList = tsComponent.classList

const createEditButton = document.querySelector(".ov-create-edit")
const cancelButton = tsComponent.querySelector(".ts-cancel")


// --- Fade in/out animations ---
// Alternative display - when viewport is too narrow

function createEditClick() {
    tsClassList.add("display")
    tsClassList.remove("hide")
    tsComponent.style.width = getComponentWidth()

    tsContainer.classList.add("display")

    // Alternative display
    if(tsContainerStyles.position !== "absolute") {
        tsContainer.classList.add("animate")
    } else {
        ovComponent.style.boxShadow = "none"
    }

    ovComponent.classList.add("visible-disabling")
}

function cancelClick() {
    tsClassList.remove("display", "enable-access")
    tsClassList.add("hide")
    tsComponent.style.width = getComponentWidth()

    tsContainer.classList.remove("display")
    tsContainer.classList.add("hide")

    if (tsContainerStyles.position !== "absolute") {
        tsContainer.classList.add("animate")
    }
}

function onAnimEnd() {
    if(tsClassList.contains("display")) {
        tsClassList.add("enable-access")
        tsComponent.style.removeProperty("width")

    } else {
        tsContainer.classList.remove("hide")
        tsClassList.remove("hide")

        ovComponent.classList.remove("visible-disabling")
        ovComponent.style.removeProperty("box-shadow")
    }

    tsContainer.classList.remove("animate")
}

// Disabling overview shadows on alternative display
let shadowDisplayed = true
function onResize() {
    if (tsContainerStyles.display == "none") return

    if (shadowDisplayed) {
        if (tsContainerStyles.position === "absolute") {
            ovComponent.style.boxShadow = "none"
            shadowDisplayed = false
        }
    } else {
        if (tsContainerStyles.position !== "absolute") {
            ovComponent.style.removeProperty("box-shadow")
            shadowDisplayed = true
        }
    }
}

window.addEventListener("resize", onResize)
tsComponent.addEventListener("animationend", onAnimEnd)
createEditButton.addEventListener("click", createEditClick)
cancelButton.addEventListener("click", cancelClick)


function getComponentWidth() {
    let width = initialScreen.clientWidth
    const screenStyles = window.getComputedStyle(initialScreen)

    width -= Number.parseFloat(screenStyles.paddingLeft)
    width -= Number.parseFloat(screenStyles.paddingRight)

    if (tsContainerStyles.position !== "absolute") {
        width -= 3*20 - 5   // Margins
        width /= 2          // width is split between 2 components
    } else {
        width -= 2*20       // Only margins for narrow viewport
    }

    return width > 400 ? "400px" : `${width}px`
}



// --- Sticky line effect ---

const scrollContainer = document.querySelector(".ts-scroll-container")
const exerciseContainer = document.querySelector(".ts-exercise-container")

let lineHidden = true
function onScroll() {

    // Sticky line effect
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
    const setContainer = exercise.querySelector(".ts-exercise-set-container")
    for (const _ of [1, 2, 3]) {
        setContainer.append(setTemplate.content.cloneNode(true))
    }

    grExerciseContainer.append(exercise)
}

exerciseContainer.append(group)

// Adds separate exercise
let exercise = exerciseTemplate.content.cloneNode(true)

let setContainer = exercise.querySelector(".ts-exercise-set-container")
for (const _ of [1, 2, 3]) {
    setContainer.append(setTemplate.content.cloneNode(true))
}

exerciseContainer.append(exercise)

exercise = exerciseTemplate.content.cloneNode(true)

setContainer = exercise.querySelector(".ts-exercise-set-container")
for (const _ of [1, 2, 3]) {
    setContainer.append(setTemplate.content.cloneNode(true))
}

exerciseContainer.append(exercise)