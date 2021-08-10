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
const settingsButton = document.querySelector(".ov-settings")
const overSettContainer = document.querySelector(".over-sett-container")

function onSettingsActivation() {
    overSettContainer.classList.toggle("display")
}

settingsButton.addEventListener("click", onSettingsActivation)