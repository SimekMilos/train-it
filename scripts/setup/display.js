
import {px, float, waitFor} from "../tools.js"
import * as overview from "../overview/overview.js"

const initialScreen = document.querySelector(".initial-screen")
const container = document.querySelector(".ts-container")
const containerStyles = window.getComputedStyle(container)
const component = container.firstElementChild

const scrollContainer = document.querySelector(".ts-scroll-container")
const groupContainer = document.querySelector(".ts-group-container")
const noExerciseElem = document.querySelector(".ts-no-exercises")
const noExerciseStyles = getComputedStyle(noExerciseElem)

let stickyLineHidden = true


// --- Interface ---

export async function display() {
    // Start display animation
    component.classList.add("display")
    container.classList.add("display")
    component.style.width = getComponentWidth()
    setGroupContainerMinHeight()
    scrollContainer.scrollTop = 0

    // Start push away efekt (standard display)/ disables shadow (overlay)
    if(containerStyles.position != "absolute") {
        container.classList.add("animate")
    } else {
        overview.hideShadow(700)
    }

    // Disable overview component in parallel
    overview.disable(700)

    // Finish display
    await waitFor("animationend", component)
    component.classList.add("enable-access")
    container.classList.remove("animate")
    component.style.removeProperty("width")
}

export async function hide() {
    // Start hide animation
    component.classList.remove("display", "enable-access")
    component.classList.add("hide")
    component.style.width = getComponentWidth()

    container.classList.add("hide")
    container.classList.remove("display")

    // Start push away efekt in standard display
    if (containerStyles.position != "absolute") {
        container.classList.add("animate")
    }

    // Enable overview component in parallel
    overview.enable(700)
    overview.displayShadow(700)

    // Finish hide
    await waitFor("animationend", component)
    component.classList.remove("hide")
    container.classList.remove("hide", "animate")
    component.style.removeProperty("width")
}


// --- Private ---

window.addEventListener("resize", overviewShadowResizeToggle)
scrollContainer.addEventListener("scroll", stickyLineEffect)
new ResizeObserver(setGroupContainerMinHeight).observe(component)


function overviewShadowResizeToggle() {
    /* Disables shadow in overview if setup component overlays over it */

    if (containerStyles.display == "none") return

    if (overview.shadowIsDisplayed()) {
        if (containerStyles.position == "absolute") overview.hideShadow()
    } else {
        if (containerStyles.position != "absolute") overview.displayShadow()
    }
}

function stickyLineEffect() {
    if (stickyLineHidden) {
        if (scrollContainer.scrollTop > groupContainer.offsetTop) {
            scrollContainer.style.borderTopColor = "var(--main-color)"
            stickyLineHidden = false
        }
    } else {
        if (scrollContainer.scrollTop <= groupContainer.offsetTop) {
            scrollContainer.style.removeProperty("border-top-color")
            stickyLineHidden = true
        }
    }
}

function setGroupContainerMinHeight() {
    let height = float(noExerciseStyles.height)
    height += float(noExerciseStyles.marginTop)
    height += float(noExerciseStyles.marginBottom)

    groupContainer.style.minHeight = px(height)
}

function getComponentWidth() {
    let width = initialScreen.clientWidth
    const screenStyles = window.getComputedStyle(initialScreen)

    width -= float(screenStyles.paddingLeft)
    width -= float(screenStyles.paddingRight)

    if (containerStyles.position !== "absolute") {
        width -= 3*20 - 5   // Margins
        width /= 2          // width is split between 2 components
    } else {
        width -= 2*20       // Only margins for narrow viewport
    }

    return width > 400 ? "400px" : px(width)
}