
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
        element.addEventListener(event, () => resolve(), {once: true})
    })
}

export async function waitForAny(...events) {
    /*
       Each event is described as an array:
        [eventString, eventElement, optionalReturnValue, optionalUseCapture]

       Output - Promise with optional return value of first event
    */

    const registered = []
    const promises = []

    // Register events
    for (const event of events) {
        const [eventStr, element, retVal, useCapture = false] = event

        promises.push(new Promise(resolve => {
            const handler = () => resolve(retVal)

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

export function generateTrainingID() {
    for(const count of range(1, Infinity)) {
        const ID = `training-${count}`
        if (!localStorage.getItem(ID)) return ID
    }
}

export async function dialog(message, ...buttons) {
    return "Replace"
}

export function sizeNotes(event) {
    const notes = event.target
    const styles = getComputedStyle(notes)
    const border = float(styles.borderTopWidth) + float(styles.borderBottomWidth)

    // Set new height
    notes.style.removeProperty("height")            // for shrinking
    const height = notes.scrollHeight + border

    if (Math.ceil(float(styles.height)) < height) { // necesary size must be
        notes.style.height = px(height)             // larger than minimum size
    }
}


// Scrolling

export function addDynamicPadding(maxHeight, scrollContainer) {
    /* Adds bottom padding to scrolling container as a filler before i.e.
    removing element.
        - Accounts for current scroll and adds only as much as needed.

    maxHeight - maximum padding height to be added
        - i.e. height of the element being removed)

    return - function that smoothly removes said padding in specified
        druation (in ms).
    */

    const cont = scrollContainer

    const remaining = cont.scrollHeight - cont.scrollTop - cont.clientHeight
    const origPadd = float(getComputedStyle(scrollContainer).paddingBottom)
    let addSize = maxHeight - remaining
    if (addSize < 0) addSize = 0

    scrollContainer.style.paddingBottom = px(origPadd + addSize)

    return async (duration = 0) => {
        if (duration) {
            let amount = origPadd + addSize
            const step = 8 * amount/duration

            while (amount > origPadd) {
                amount -= step
                scrollContainer.style.paddingBottom = px(amount)
                await wait(8)       // 120 fps
            }
        }

        scrollContainer.style.removeProperty("padding-bottom")
    }
}

export async function dynamicScrollDown(distance, duration, scrollContainer) {
    // Detect where content ends
    const last = scrollContainer.lastElementChild
    let {bottom: contentEnd} = last.getBoundingClientRect()
    contentEnd += float(getComputedStyle(last).marginBottom)

    // Add filler distance in case content is smaller than scrollContainer
    const {bottom: containerEnd} = scrollContainer.getBoundingClientRect()
    const filler = containerEnd - contentEnd
    if (filler > 0) distance += filler

    // Add padding
    const removePadding = addDynamicPadding(distance, scrollContainer)

    // Setup values for scrolling
    const start = scrollContainer.scrollTop
    const stop = start + distance
    const step = 8 * distance/duration

    // Scroll
    for (let scrolled = start + step; scrolled < stop; scrolled += step) {
        scrollContainer.scrollTop = scrolled
        await wait(8)   // 120 fps
    }
    scrollContainer.scrollTop = stop

    return removePadding
}