
// --- Overview Settings Component ---


const settingsContainer = document.querySelector(".over-sett-container")
const settingsElem = settingsContainer.firstElementChild    // ".comp-over-settings"
const overviewComp = document.querySelector(".comp-overview")
const elemClassList = settingsElem.classList

const settingsButton = document.querySelector(".ov-settings")
const closeButton = document.querySelector(".ov-sett-close")


// Event listeners

function onSettingsClick() {
    // Set new state
    if (elemClassList.contains("display") || elemClassList.contains("hide")) {
        elemClassList.toggle("display")
        elemClassList.toggle("hide")
    } else {
        elemClassList.add("display")
    }

    // Displaying
    if(elemClassList.contains("display")) {
        // Display
        elemClassList.remove("disp-none")

        // Get dimensions
        const height = settingsElem.getBoundingClientRect().height
        const margin = Number.parseInt(getComputedStyle(settingsElem).marginTop)

        // Resize
        settingsContainer.style.height = `${height + margin}px`
        window.addEventListener("resize", onResize)

    // Hiding
    } else {
        // Resize
        settingsContainer.style.height = "0"
        window.removeEventListener("resize", onResize)

        // Disable access to controls
        elemClassList.remove("enable-access")
    }

    floatingMode()
}

function onCloseButtonClick() {
    // Set new state
    elemClassList.add("hide")
    elemClassList.remove("display")

    settingsContainer.style.height = "0"

    // Disable access to controls
    elemClassList.remove("enable-access")

    floatingMode()
}

function onAnimationEnd() {
    // Displaying - enable access to controls
    if(elemClassList.contains("display")) {
        elemClassList.add("enable-access")

    // Hiding - undisplay
    } else {
        elemClassList.add("disp-none")
    }
}

function onResize() {
    // Prevent resize change during hiding animation
    if(!elemClassList.contains("display")) return

    // Get dimensions
    const currentHeight = Number.parseInt(settingsContainer.style.height)
    const newHeight = settingsElem.getBoundingClientRect().height
    const margin = Number.parseInt(getComputedStyle(settingsElem).marginTop)

    // Resize
    if (currentHeight !== newHeight) {
        settingsContainer.style.height = `${newHeight + margin}px`
    }

    floatingMode()
}

settingsElem.addEventListener("animationend", onAnimationEnd)
settingsButton.addEventListener("click", onSettingsClick)
closeButton.addEventListener("click", onCloseButtonClick)


// Other functionality

function floatingMode() {
    /* Floats settings over overview component if there is not
        enough vertical space
    */

    const style = settingsContainer.style

    // Getting heights
    const minOverview = Number.parseInt(window.getComputedStyle(overviewComp).minHeight)
    const currentSettings = settingsElem.getBoundingClientRect().height

    // Activating
    if ((minOverview + currentSettings + 44) >= window.innerHeight) {
        if(elemClassList.contains("display")) {
            // Set up position
            if (!style.position) {
                style.position = "absolute"
                style.transform = "translate(-50%, -50%)"
            }
            style.width = window.getComputedStyle(overviewComp).width

            // Disable overview component
            overviewComp.classList.add("visible-disabling")
        } else {
            // Enable overview component
            overviewComp.classList.remove("visible-disabling")
        }

    // Disabling
    } else {
        // Clean up position
        if(style.position) {
            style.removeProperty("position")
            style.removeProperty("transform")
            style.removeProperty("width")
        }

        // Enable overview component
        overviewComp.classList.remove("visible-disabling")
    }
}