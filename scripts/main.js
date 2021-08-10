"use strict"

function onAppLoad() {
    // Deactivate loading screen
    const lScreen = document.querySelector(".loading-screen")
    lScreen.style.display = "none"

    const loadingElem = document.querySelector(".loading-screen p")
    loadingElem.style.animationPlayState = "paused"


    // Display overview
    const overview = document.querySelector(".comp-overview")
    overview.classList.add("display")
}

window.addEventListener("load", onAppLoad)


// Overview settings activation
const settingsContainer = document.querySelector(".over-sett-container")
const overviewSettings = document.querySelector(".comp-over-settings")

const settingsButton = document.querySelector(".ov-settings")
const closeButton = document.querySelector(".ov-sett-close")


function onSettingsClick() {
    const classes = overviewSettings.classList

    if (classes.contains("display") || classes.contains("hide")) {
        classes.toggle("hide")
    }

    classes.toggle("display")

    if(classes.contains("display")) {
        const height = overviewSettings.getBoundingClientRect().height

        let margin = getComputedStyle(overviewSettings).marginTop.slice(0, -2)
        margin = Number.parseInt(margin)

        settingsContainer.style.height = `${height + margin}px`
        window.addEventListener("resize", onResize)

    } else {
        settingsContainer.style.height = "0"
        window.removeEventListener("resize", onResize)
    }
}

function onCloseButtonClick() {
    overviewSettings.classList.add("hide")
    overviewSettings.classList.remove("display")
    settingsContainer.style.height = "0"
}

function onResize() {
    let currentHeight = settingsContainer.style.height
    currentHeight = Number.parseInt(currentHeight.slice(0, -2))

    const newHeight = overviewSettings.getBoundingClientRect().height

    let margin = getComputedStyle(overviewSettings).marginTop.slice(0, -2)
    margin = Number.parseInt(margin)

    if (currentHeight !== newHeight) {
        settingsContainer.style.height = `${newHeight + margin}px`
    }
}

settingsButton.addEventListener("click", onSettingsClick)
closeButton.addEventListener("click", onCloseButtonClick)