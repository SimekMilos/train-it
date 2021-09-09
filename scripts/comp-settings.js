
const component = document.querySelector(".settings-component")
const mainWidnow = document.querySelector(".sett-main-window")

const settingsButton = document.querySelector(".ts-settings")
const closeButton = document.querySelector(".sett-close")

let animationInProgress = false


function onSettingsClick() {
    component.classList.add("display")
    animationInProgress = true
}

function onCloseClick() {
    component.classList.add("hide")
    component.classList.remove("display")

    mainWidnow.classList.remove("enable-access")
    animationInProgress = true
}

function componentCloseClick(e) {
    if (!animationInProgress && e.target == component) {
        onCloseClick()
    }
}

function onAnimationEnd() {
    if (component.classList.contains("display")) {
        mainWidnow.classList.add("enable-access")
    } else {
        component.classList.remove("hide")
    }

    animationInProgress = false
}

settingsButton.addEventListener("click", onSettingsClick)
closeButton.addEventListener("click", onCloseClick)
component.addEventListener("click", componentCloseClick)
mainWidnow.addEventListener("animationend", onAnimationEnd)
