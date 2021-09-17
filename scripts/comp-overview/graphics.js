
const overviewCom = document.querySelector(".overview-component")


// --- Displaying component ---

let resolveHide = null

export function displayComponent() {
    overviewCom.classList.add("display")
}

export function hideComponent() {
    overviewCom.classList.add("hide")
    overviewCom.classList.remove("display", "enable-access")

    return new Promise((resolve) => {
        resolveHide = resolve
    })
}

function onAnimationEnd() {
    // Displaying
    if(overviewCom.classList.contains("display")) {
        overviewCom.classList.add("enable-access")

    // Hiding
    } else {
        overviewCom.classList.remove("hide")
        resolveHide()
    }
}

overviewCom.addEventListener("animationend", onAnimationEnd)