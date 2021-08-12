
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


// Temporary
const trainingTemplate = document.querySelector(".ov-training-template")
const trainingList = document.querySelector(".ov-training-list")

const trainings = document.createDocumentFragment()

for (const [id, text] of [["tr1", "First Training"],
                          ["tr2", "Second training"],
                          ["tr3", "Third Training"]]) {

    const training = trainingTemplate.content.cloneNode(true)

    const input = training.querySelector("input")
    const label = training.querySelector("label")
    const p = training.querySelector("p")

    input.id = id
    label.htmlFor = id
    p.textContent = text

    trainings.append(training)
}

trainingList.append(trainings)