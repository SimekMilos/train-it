
const component = document.querySelector(".settings-component")
const mainWidnow = document.querySelector(".sett-main-window")

const settingsButton = document.querySelector(".ts-settings")
const closeButton = document.querySelector(".sett-close")


function onSettingsClick() {
    component.classList.add("display")
}

function onCloseClick() {
    component.classList.add("hide")
    component.classList.remove("display")
}

function onAnimationEnd() {
    if (component.classList.contains("display")) {

    } else {
        component.classList.remove("hide")
    }
}

settingsButton.addEventListener("click", onSettingsClick)
closeButton.addEventListener("click", onCloseClick)
mainWidnow.addEventListener("animationend", onAnimationEnd)