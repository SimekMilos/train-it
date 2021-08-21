
const initialScreen = document.querySelector(".initial-screen")

const tsContainer = document.querySelector(".ts-container")
const tsContainerStyles = window.getComputedStyle(tsContainer)

const tsComponent = tsContainer.firstElementChild
const tsCancelButton = tsComponent.querySelector(":scope .ts-cancel")

const ovComponent = document.querySelector(".overview-component")
const ovCreateEditButton = document.querySelector(".ov-create-edit")


// --- Fade in/out animations ---
// Alternative display - when viewport is too narrow

function createEditClick() {
    // ts component
    tsComponent.classList.add("display")
    tsComponent.classList.remove("hide")
    tsComponent.style.width = getComponentWidth()

    // ts container
    tsContainer.classList.add("display")

        // Alternative display
    if(tsContainerStyles.position !== "absolute") {
        tsContainer.classList.add("animate")
    } else {
        ovComponent.style.boxShadow = "var(--comp-shadow-hidden)"
    }

    // ov component
    ovComponent.classList.add("visible-disabling", "disable-transition")
    ovComponent.style.setProperty("--disable-duration", ".7s")
    setTimeout(() => {
        ovComponent.classList.add("disable-tran-progress")
    },0)
}

function cancelClick() {
    // ts component
    tsComponent.classList.remove("display", "enable-access")
    tsComponent.classList.add("hide")
    tsComponent.style.width = getComponentWidth()

    // ts container
    tsContainer.classList.remove("display")
    tsContainer.classList.add("hide")

    if (tsContainerStyles.position !== "absolute") {
        tsContainer.classList.add("animate")
    }

    // ov component
    ovComponent.classList.remove("disable-tran-progress")
    ovComponent.style.removeProperty("box-shadow")
}

function onAnimEnd() {
    if(tsComponent.classList.contains("display")) {
        tsComponent.classList.add("enable-access")
        tsComponent.style.removeProperty("width")

    } else {
        tsComponent.classList.remove("hide")
        tsContainer.classList.remove("hide")

        ovComponent.classList.remove("disable-transition", "visible-disabling")
        ovComponent.style.removeProperty("--disable-duration")
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
tsCancelButton.addEventListener("click", cancelClick)
ovCreateEditButton.addEventListener("click", createEditClick)


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