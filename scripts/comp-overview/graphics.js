
const overviewComponent = document.querySelector(".overview-component")
const compClassList = overviewComponent.classList


// --- Intro/outro animations ---

overviewComponent.addEventListener("animationend", onAnimationEnd)

function onAnimationEnd() {
    // Displaying - enable access to controls
    if(compClassList.contains("display")) {
        compClassList.add("enable-access")

    // Hiding - undisplay
    } else {
        compClassList.remove("hide")
    }
}

/*
TODO: at places displaying/hiding Overview
    - disable access when outro animation starts
*/