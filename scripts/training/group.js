
import {float, px} from "../tools.js"

import Exercise from "./exercise.js"
import {notesFunctionality} from "./notes.js"

const groupTemplate = document.querySelector(".tc-group-template")
const nogroupTemplate = document.querySelector(".tc-no-group-template")


export default class Group {
    constructor(groupData, container) {
        let groupFrag

        // Group
        if (groupData.type == "group") {
            groupFrag = groupTemplate.content.cloneNode(true)
            this._group = groupFrag.firstElementChild
            this._groupContainer = this._group.querySelector(":scope .tcg-container")

            // Name
            const name = this._group.querySelector("h3")
            name.textContent = groupData.name

            // Notes
            const notes = this._group.querySelector(":scope .tcg-notes")
            const notesButton = this._group.querySelector(":scope .tcg-notes-button")
            notesFunctionality(notes, notesButton, groupData,
                               this._fitWidth.bind(this))

        // No Group
        } else {
            groupFrag = nogroupTemplate.content.cloneNode(true)
            this._group = groupFrag.firstElementChild
            this._groupContainer = this._group
        }

        // Add exercises
        const exercises = []
        for (const exerciseData of groupData.exercises) {
            exercises.push(new Exercise(exerciseData, this._groupContainer,
                           this._fitWidth.bind(this)))
        }

        container.append(groupFrag)
    }

    destruct() {
        this._group.remove()
    }


    // --- Private ---

    _fitWidth() {
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