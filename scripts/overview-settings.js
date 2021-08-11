
// --- Scripts for Overview Settings ---


const settingsContainer = document.querySelector(".over-sett-container")
const settingsElem = settingsContainer.firstElementChild    // ".comp-over-settings"
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
        let margin = getComputedStyle(settingsElem).marginTop.slice(0, -2)
        margin = Number.parseInt(margin)

        // Resize
        settingsContainer.style.height = `${height + margin}px`
        window.addEventListener("resize", onResize)

    // Hiding
    } else {
        // Resize
        settingsContainer.style.height = "0"
        window.removeEventListener("resize", onResize)

        // Disable controllers
        elemClassList.remove("enable-contr")
    }
}

function onCloseButtonClick() {
    // Set new state
    elemClassList.add("hide")
    elemClassList.remove("display")

    settingsContainer.style.height = "0"

    // Hiding element
    elemClassList.remove("enable-contr")
}

function onResize() {
    // Prevent resize change during hiding animation
    if(!elemClassList.contains("display")) return

    // Get dimensions
    let currentHeight = settingsContainer.style.height
    const newHeight = settingsElem.getBoundingClientRect().height
    let margin = getComputedStyle(settingsElem).marginTop.slice(0, -2)

    // Retype dimensions
    currentHeight = Number.parseInt(currentHeight.slice(0, -2))
    margin = Number.parseInt(margin)

    // Resize
    if (currentHeight !== newHeight) {
        settingsContainer.style.height = `${newHeight + margin}px`
    }
}

settingsButton.addEventListener("click", onSettingsClick)
closeButton.addEventListener("click", onCloseButtonClick)

