"use strict"

function onAppLoad() {
    // Deactivate loading screen
    const lScreen = document.querySelector(".loading-screen")
    lScreen.style.display = "none"

    const loadingElem = document.querySelector(".loading-screen p")
    loadingElem.style.animationPlayState = "paused"


    // Display overview
    const overview = document.querySelector(".overview-component")
    overview.classList.add("display")
}

window.addEventListener("load", onAppLoad)

