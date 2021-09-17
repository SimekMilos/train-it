
const overviewCom = document.querySelector(".overview-component")


// --- Displaying component ---

/*
TODO: at places displaying/hiding Overview
    - disable access when outro animation starts
*/

export function displayComponent() {
    overviewCom.classList.add("display")
}

export function hideComponent() {

}

overviewCom.addEventListener("animationend", onAnimationEnd)

function onAnimationEnd() {
    // Displaying - enable access to controls
    if(overviewCom.classList.contains("display")) {
        overviewCom.classList.add("enable-access")

    // Hiding - undisplay
    } else {
        overviewCom.classList.remove("hide")
    }
}