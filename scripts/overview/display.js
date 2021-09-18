
const overviewComponent = document.querySelector(".overview-component")
const compClassList = overviewComponent.classList
const compStyle = overviewComponent.style

let resolveTransition = null


// --- Interface ---

export function display() {
    compClassList.add("display")

    return new Promise(resolve => resolveTransition = resolve)
}

export function hide() {
    compClassList.add("hide")
    compClassList.remove("display", "enable-access")

    return new Promise(resolve => resolveTransition = resolve)
}

export function disable(animDuration = 0) {
    /* animDuration - time in ms */

    compStyle.setProperty("--disable-anim-duration", `${animDuration / 1000}s`)
    compClassList.add("disable-visible-display")

    return new Promise(resolve => resolveTransition = resolve)
}

export function enable(animDuration = 0) {
    /* animDuration - time in ms */

    compStyle.setProperty("--disable-anim-duration", `${animDuration / 1000}s`)
    compClassList.add("disable-visible-hide")
    compClassList.remove("disable-visible-display")

    return new Promise(resolve => resolveTransition = resolve)
}


// --- Private ---

overviewComponent.addEventListener("animationend", onAnimationEnd)

function onAnimationEnd() {
    resolveTransition()

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
