
const overviewComponent = document.querySelector(".overview-component")
const settingsButton = document.querySelector(".ov-settings")

const compClassList = overviewComponent.classList
const compStyle = overviewComponent.style

let resolveAction = null


// --- Interface ---

// Display

export function display() {
    compClassList.add("display")

    return new Promise(resolve => resolveAction = resolve)
}

export function hide() {
    compClassList.add("hide")
    compClassList.remove("display", "enable-access")

    return new Promise(resolve => resolveAction = resolve)
}


// Disabling

export function disable(animDuration = 0) {
    /* animDuration - time in ms */

    compStyle.setProperty("--disable-anim-duration", `${animDuration / 1000}s`)
    compClassList.add("disable-visible-display")

    return new Promise(resolve => resolveAction = resolve)
}

export function enable(animDuration = 0) {
    /* animDuration - time in ms */

    compStyle.setProperty("--disable-anim-duration", `${animDuration / 1000}s`)
    compClassList.add("disable-visible-hide")
    compClassList.remove("disable-visible-display")

    return new Promise(resolve => resolveAction = resolve)
}

export function isDisabled() {
    return compClassList.contains("disable-visible-display")
}


// Settings button

export function settingsButtonDisable(disable) {
    settingsButton.disabled = disable
}


// --- Private ---

overviewComponent.addEventListener("animationend", onAnimationEnd)

function onAnimationEnd() {
    resolveAction()

    // Disabling/enabling
    if (compClassList.contains("disable-visible-display") ||
        compClassList.contains("disable-visible-hide")) {

        compClassList.remove("disable-visible-hide")
        return
    }

    // Displaying
    if (compClassList.contains("display")) {
        compClassList.add("enable-access")

    // Hiding
    } else {
        compClassList.remove("hide")
    }
}
