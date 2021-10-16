
const template = document.querySelector(".tc-exercise-set-template")

const defaultName = "Set"


export default class Set {
    constructor(nameStr, container) {
        const setFrag = template.content.cloneNode(true)
        const set = setFrag.firstElementChild

        // Name
        const name = set.querySelector(":scope .tcex-name")
        if (!nameStr) name.textContent = defaultName
        else          name.textContent = nameStr

        container.append(setFrag)
    }
}