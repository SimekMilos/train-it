
import {sizeNotes} from "../tools.js"

const groupTemplate = document.querySelector(".tc-group-template")
const nogroupTemplate = document.querySelector(".tc-no-group-template")


export class Group {
    constructor(groupData, container) {
        let group, groupFrag, groupContainer

        // Group
        if (groupData.type == "group") {
            groupFrag = groupTemplate.content.cloneNode(true)
            group = groupFrag.firstElementChild
            groupContainer = group.querySelector(".tcg-container")

            this._notesButton = group.querySelector(".tcg-notes-button")
            this._notes = group.querySelector(".tcg-notes")

            // Heading
            const heading = group.querySelector("h3")
            heading.textContent = groupData.name

            // Notes
            if (groupData.notes) {
                this._notes.value = groupData.notes
                this._displayNotes()

                // Note sizing on display
                const observer = new ResizeObserver(() => {
                    sizeNotes(this._notes)
                    observer.disconnect()
                })
                observer.observe(this._notes)
            }

        // No Group
        } else {
            groupFrag = nogroupTemplate.content.cloneNode(true)
            group = groupFrag.firstElementChild
            groupContainer = group.querySelector(".tc-no-group")
        }

        container.append(groupFrag)
    }

    _displayNotes() {
        this._notesButton.style.display = "none"
        this._notes.style.display = "block"
    }
}