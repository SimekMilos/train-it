
import {float, px, sizeNotes} from "../tools.js"
import Exercise from "./exercise.js"

const groupTemplate = document.querySelector(".tc-group-template")
const nogroupTemplate = document.querySelector(".tc-no-group-template")


export default class Group {
    constructor(groupData, container) {
        let groupFrag, notes = null

        // Group
        if (groupData.type == "group") {
            groupFrag = groupTemplate.content.cloneNode(true)
            this._group = groupFrag.firstElementChild
            this._groupContainer = this._group.querySelector(":scope .tcg-container")

            // Name
            const name = this._group.querySelector("h3")
            name.textContent = groupData.name

            // Notes
            notes = this._group.querySelector(":scope .tcg-notes")
            const notesButton = this._group.querySelector(":scope .tcg-notes-button")

            if (groupData.notes) {
                notes.value = groupData.notes

                notesButton.style.display = "none"
                notes.style.display = "block"
            }

            // notes.addEventListener("input", )

        // No Group
        } else {
            groupFrag = nogroupTemplate.content.cloneNode(true)
            this._group = groupFrag.firstElementChild
            this._groupContainer = this._group
        }

        // Sizing
        const widthObserver = new ResizeObserver(() => {
            if (notes) sizeNotes(notes)
            this.fitWidth()
        })
        widthObserver.observe(container)

        // Add exercises
        const exercises = []
        for (const exerciseData of groupData.exercises) {
            exercises.push(new Exercise(exerciseData, this._groupContainer))
        }

        container.append(groupFrag)
    }

    destruct() {
        this._group.remove()
    }

    fitWidth() {
        let first = this._groupContainer.firstElementChild
        const last = this._groupContainer.lastElementChild

        // When first element isn't displayed
        if (getComputedStyle(first).display == "none") {
            first = first.nextElementSibling
        }

        let start = first.getBoundingClientRect().left
        start -= float(getComputedStyle(first).marginLeft)

        let end = last.getBoundingClientRect().right
        end += float(getComputedStyle(last).marginRight)

        this._groupContainer.style.width = px(end - start)
    }
}
