
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
        overviewSettings.classList.remove("disp-none")

        const height = overviewSettings.getBoundingClientRect().height

        let margin = getComputedStyle(overviewSettings).marginTop.slice(0, -2)
        margin = Number.parseInt(margin)

        settingsContainer.style.height = `${height + margin}px`
        window.addEventListener("resize", onResize)

    } else {
        settingsContainer.style.height = "0"
        window.removeEventListener("resize", onResize)
        setTimeout(() => {
            overviewSettings.classList.add("disp-none")
        }, 700)
    }

    hideControlsTemp(overviewSettings, .7)
}

function onCloseButtonClick() {
    overviewSettings.classList.add("hide")
    overviewSettings.classList.remove("display")
    settingsContainer.style.height = "0"
    hideControlsTemp(overviewSettings, .7)
    setTimeout(() => {
        overviewSettings.classList.add("disp-none")
    }, 700)
}

function onResize() {
    //for resizing while hiding
    if(!overviewSettings.classList.contains("display")) return

    let currentHeight = settingsContainer.style.height
    currentHeight = Number.parseInt(currentHeight.slice(0, -2))

    const newHeight = overviewSettings.getBoundingClientRect().height

    let margin = getComputedStyle(overviewSettings).marginTop.slice(0, -2)
    margin = Number.parseInt(margin)

    if (currentHeight !== newHeight) {
        settingsContainer.style.height = `${newHeight + margin}px`
    }
}

function hideControlsTemp(elem, timeInS) {
    const cls = elem.classList
    cls.add("hide-contr")

    setTimeout(() => {
        cls.remove("hide-contr")
    }, timeInS*1000)
}

settingsButton.addEventListener("click", onSettingsClick)
closeButton.addEventListener("click", onCloseButtonClick)