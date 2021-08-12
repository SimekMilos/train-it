
const overviewElem = document.querySelector(".comp-overview")
const classList = overviewElem.classList

/*
TODO: at places displaying/hiding Overview
    - disable access when outro animation starts
    - remove disp-none before intro animation begins
*/

function onAnimationEnd() {
    // Displaying - enable access to controls
    if(classList.contains("display")) {
        classList.add("enable-access")

    // Hiding - undisplay
    } else {
        classList.add("disp-none")
    }
}

overviewElem.addEventListener("animationend", onAnimationEnd)