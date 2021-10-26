
export const float = Number.parseFloat
export const int = Number.parseInt
window.log = console.log

export function px(value) {
    if(typeof value == "number") value = value.toFixed(2)
    return `${value}px`
}

export function* range(startStop, stop, step) {
    let start;

    // 1 param
    if (startStop && !stop) {
        start = 0
        stop = startStop

    // 2 params
    } else {
        start = startStop
    }

    // 3. param
    if (!step) step = 1

    // iterate
    for (let i = start; i < stop; i += step) {
        yield i
    }
}

export function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export function waitFor(event, element) {
    return new Promise(resolve => {
        element.addEventListener(event, (ev) => resolve(ev), {once: true})
    })
}

export async function waitForAny(...events) {
    /*
       Each event is described as an array:
        [eventString, eventElement, optionalReturnValue, optionalUseCapture]

        optionalReturnValue - if undefined event object is returned

       Output - Promise with optional return value of first event
    */

    const registered = []
    const promises = []

    // Register events
    for (const event of events) {
        const [eventStr, element, retVal, useCapture = false] = event

        promises.push(new Promise(resolve => {
            const handler = (ev) => {
                if (retVal === undefined) resolve(ev)
                else resolve(retVal)
            }

            element.addEventListener(eventStr, handler, useCapture)
            registered.push([element, eventStr, handler, useCapture])
        }))
    }

    // Wait for first event
    const retVal = await Promise.any(promises)

    // Unregister events
    for (const listener of registered) {
        const [element, eventStr, handler, useCapture] = listener
        element.removeEventListener(eventStr, handler, useCapture)
    }

    return retVal
}

export function asyncContextManager(before, after) {
    return async (inContext) => {
        const retVal = await before()
        try {
            return await inContext(retVal)
        } finally {
            await after(retVal)
        }
    }
}

export function generateTrainingID() {
    for(const count of range(1, Infinity)) {
        const ID = `training-${count}`
        if (!localStorage.getItem(ID)) return ID
    }
}

export async function dialog(message, ...buttons) {
    if (!buttons.length) throw new Error("Dialog must have at least 1 button.")

    // Create overlay elem
    const dialogOverlay = document.createElement("div")
    dialogOverlay.classList.add("dialog")

    // Create main dialog window
    const dialog = document.createElement("div")
    dialog.classList.add("main")
    dialogOverlay.append(dialog)

    // Add message
    const messageElem = document.createElement("p")
    messageElem.textContent = message
    dialog.append(messageElem)

    // Add buttons
    const buttonOrganiser = document.createElement("div")
    buttonOrganiser.classList.add("buttons")
    dialog.append(buttonOrganiser)

    const events = []
    for (const buttName of buttons) {
        const button = document.createElement("button")
        button.textContent = buttName
        buttonOrganiser.append(button)

        events.push(["click", button, buttName])
    }

    // Display dialog
    document.body.append(dialogOverlay)
    const action = await waitForAny(...events)

    // Close
    dialogOverlay.remove()
    return action
}

export function getWatchString(time) {
    let seconds = time % 60
    let minutes = ((time - seconds) / 60) % 60
    seconds = String(seconds).padStart(2, "0")
    minutes = String(minutes).padStart(2, "0")

    return `${minutes}:${seconds}`
}

export function sizeNotes(elemOrEvent) {
    let notes = elemOrEvent
    if (elemOrEvent instanceof Event) notes = elemOrEvent.target

    // Test for display
    const style = getComputedStyle(notes)
    if (style.display == "none") return

    const border = float(style.borderTopWidth) + float(style.borderBottomWidth)

    // Set new height
    notes.style.removeProperty("height")            // enables shrinking
    const height = notes.scrollHeight + border

    if (Math.ceil(float(style.height)) < height) { // necessary size must be
        notes.style.height = px(height)             // larger than minimum size
    }
}