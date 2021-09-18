
const overviewCom = document.querySelector(".overview-component")
const compClassList = overviewCom.classList

let resolveHide = null


// --- Interface ---

export function display() {
    compClassList.add("display")
}

export function hide() {
    compClassList.add("hide")
    compClassList.remove("display", "enable-access")

    return new Promise(resolve => resolveHide = resolve)
}


// --- Private ---

overviewCom.addEventListener("animationend", onAnimationEnd)

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
