
const overviewCom = document.querySelector(".overview-component")
const compClassList = overviewCom.classList


// --- Displaying component ---

let resolveHide = null

export function display() {
    compClassList.add("display")
}

export function hide() {
    compClassList.add("hide")
    compClassList.remove("display", "enable-access")

    return new Promise((resolve) => {
        resolveHide = resolve
    })
}

function onAnimationEnd() {
    // Displaying
    if(compClassList.contains("display")) {
        compClassList.add("enable-access")

    // Hiding
    } else {
        compClassList.remove("hide")
        resolveHide()
    }
}

overviewCom.addEventListener("animationend", onAnimationEnd)