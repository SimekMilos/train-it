
import {float, px} from "./tools.js"

const component = document.querySelector(".settings-component")
const mainWidnow = document.querySelector(".sett-main-window")
const scrollContainer = document.querySelector(".sett-scroll-container")

const settingsButton = document.querySelector(".ts-settings")
const closeButton = document.querySelector(".sett-close")

let animationInProgress = false
const heightObserver = new ResizeObserver(setMaxHeight)


function onSettingsClick() {
    component.classList.add("display")
    animationInProgress = true

    setMaxHeight()
    heightObserver.observe(mainWidnow)
}

function onCloseClick() {
    component.classList.add("hide")
    component.classList.remove("display")

    mainWidnow.classList.remove("enable-access")
    animationInProgress = true

    heightObserver.disconnect()
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


// Sett component max-height

function setMaxHeight() {
    const {top: mainTop} = mainWidnow.getBoundingClientRect()
    const {top: scrollTop} = scrollContainer.getBoundingClientRect()

    const topOffset = scrollTop - mainTop
    const bottomPadding = float(getComputedStyle(mainWidnow).paddingBottom)
    const maxHeight = scrollContainer.scrollHeight + topOffset + bottomPadding

    mainWidnow.style.maxHeight = px(maxHeight)
}