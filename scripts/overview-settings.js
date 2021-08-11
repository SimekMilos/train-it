
// --- Scripts for Overview Settings ---


const settingsContainer = document.querySelector(".over-sett-container")
const settingsElem = settingsContainer.firstElementChild

const settingsButton = document.querySelector(".ov-settings")
const closeButton = document.querySelector(".ov-sett-close")


// Event listeners

function onSettingsClick() {
    const classes = settingsElem.classList

    if (classes.contains("display") || classes.contains("hide")) {
        classes.toggle("hide")
    }

    classes.toggle("display")

    if(classes.contains("display")) {
        settingsElem.classList.remove("disp-none")

        const height = settingsElem.getBoundingClientRect().height

        let margin = getComputedStyle(settingsElem).marginTop.slice(0, -2)
        margin = Number.parseInt(margin)

        settingsContainer.style.height = `${height + margin}px`
        window.addEventListener("resize", onResize)

        function enableControls() { settingsElem.classList.add("enable-contr") }
        setTimeout(enableControls, 700)

    } else {
        settingsContainer.style.height = "0"
        window.removeEventListener("resize", onResize)
        setTimeout(() => {
            settingsElem.classList.add("disp-none")
        }, 700)

        settingsElem.classList.remove("enable-contr")
    }
}

function onCloseButtonClick() {
    settingsElem.classList.add("hide")
    settingsElem.classList.remove("display")

    settingsContainer.style.height = "0"

    // Hiding element
    settingsElem.classList.remove("enable-contr")
    function undisplay() { settingsElem.classList.add("disp-none") }
    setTimeout(undisplay, 700)
}

function onResize() {
    // Prevent resize change during hiding animation
    if(!settingsElem.classList.contains("display")) return

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

