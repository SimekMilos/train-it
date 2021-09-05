
import {px, float} from "./tools.js"

const settingsContainer = document.querySelector(".ov-container")
const settingsComponent = settingsContainer.firstElementChild
const overviewComponent = document.querySelector(".overview-component")
const compClassList = settingsComponent.classList

const settingsButton = document.querySelector(".ov-settings")
const closeButton = document.querySelector(".ovs-close")


// Event listeners

function onSettingsClick() {
    settingsButton.disabled = true
    closeButton.disabled = true

    // Set new state
    if (!compClassList.contains("display")) {
        compClassList.add("display")
    } else {
        compClassList.remove("display")
        compClassList.add("hide")
    }

    // Displaying
    if(compClassList.contains("display")) {
        // Get dimensions
        const height = settingsComponent.getBoundingClientRect().height
        const marginTop = float(getComputedStyle(settingsComponent).marginTop)

        // Resize
        settingsContainer.style.height = px(height + marginTop)
        window.addEventListener("resize", onResize)

    // Hiding
    } else {
        // Resize
        settingsContainer.style.height = "0"
        window.removeEventListener("resize", onResize)

        // Disable access to controls
        compClassList.remove("enable-access")
    }

    floatingMode(false)
}

function onCloseButtonClick() {
    settingsButton.disabled = true
    closeButton.disabled = true

    // Set new state
    compClassList.add("hide")
    compClassList.remove("display")

    settingsContainer.style.height = "0"

    // Disable access to controls
    compClassList.remove("enable-access")

    floatingMode(false)
}

function onAnimationEnd() {
    // Displaying - enable access to controls
    if(compClassList.contains("display")) {
        compClassList.add("enable-access")

    // Hiding - undisplay
    } else {
        compClassList.remove("hide")
    }

    settingsButton.disabled = false
    closeButton.disabled = false
}

function onResize() {
    // Prevent resize change during hiding animation
    if(!compClassList.contains("display")) return

    // Get dimensions
    const currentHeight = float(settingsContainer.style.height)
    const newHeight = settingsComponent.getBoundingClientRect().height
    const marginTop = float(getComputedStyle(settingsComponent).marginTop)

    // Resize
    if (currentHeight !== newHeight) {
        settingsContainer.style.height = px(newHeight + marginTop)
    }

    floatingMode(true)
}

settingsComponent.addEventListener("animationend", onAnimationEnd)
settingsButton.addEventListener("click", onSettingsClick)
closeButton.addEventListener("click", onCloseButtonClick)


// Other functionality

function floatingMode(resize) {
    /* Floats settings over overview component if there is not
        enough vertical space
    */

    const style = settingsContainer.style

    // Getting heights
    const minOverview = float(window.getComputedStyle(overviewComponent).minHeight)
    const currentSettings = settingsComponent.getBoundingClientRect().height

    // Activating
    if ((minOverview + currentSettings + 44) >= window.innerHeight) {
        if(compClassList.contains("display")) {
            // Set up position
            if (!style.position) {
                style.position = "absolute"
                style.transform = "translate(-50%, -50%)"
            }

            // Set width
            const overviewWidth = window.getComputedStyle(overviewComponent).width
            style.width = px(float(overviewWidth) - 30)

            // Disable overview component
            if (!resize) {
                overviewComponent.style.setProperty("--disable-anim-duration", ".4s")
            }
            overviewComponent.classList.add("disable-visible-display")

        } else {
            // Enable overview component
            if (!resize) {
                overviewComponent.style.setProperty("--disable-anim-duration", ".4s")
            }
            overviewComponent.classList.remove("disable-visible-display")
            overviewComponent.classList.add("disable-visible-hide")

            setTimeout(() => {
                overviewComponent.classList.remove("disable-visible-hide")
                overviewComponent.style.removeProperty("--disable-anim-duration")
            }, 400)
        }

    // Deactivating
    } else {
        // Clean up position
        if(style.position) {
            style.removeProperty("position")
            style.removeProperty("transform")
            style.removeProperty("width")
        }

        // Enable overview component
        overviewComponent.style.removeProperty("--disable-anim-duration")
        overviewComponent.classList.remove("disable-visible-display")
    }
}