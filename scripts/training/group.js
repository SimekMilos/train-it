
import {sizeNotes} from "../tools.js"

const groupTemplate = document.querySelector(".tc-group-template")
const nogroupTemplate = document.querySelector(".tc-no-group-template")


export class Group {
    constructor(groupData, container) {
        let groupFrag, groupContainer

        // Group
        if (groupData.type == "group") {
            groupFrag = groupTemplate.content.cloneNode(true)
            this._group = groupFrag.firstElementChild
            groupContainer = this._group.querySelector(":scope .tcg-container")

            // Heading
            const heading = this._group.querySelector("h3")
            heading.textContent = groupData.name

            // Notes
            const notes = this._group.querySelector(":scope .tcg-notes")
            const notesButton = this._group.querySelector(":scope .tcg-notes-button")

            if (groupData.notes) {
                notes.value = groupData.notes

                notesButton.style.display = "none"
                notes.style.display = "block"

                // Note sizing on display
                const observer = new ResizeObserver(() => {
                    sizeNotes(notes)
                    observer.disconnect()
                })
                observer.observe(notes)
            }

            // notes.addEventListener("input", )

        // No Group
        } else {
            groupFrag = nogroupTemplate.content.cloneNode(true)
            this._group = groupFrag.firstElementChild
            groupContainer = this._group
        }


        container.append(groupFrag)
    }

    destruct() {
        this._group.remove()
    }
}