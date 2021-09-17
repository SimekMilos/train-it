


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