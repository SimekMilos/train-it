
export const float = Number.parseFloat
export const int = Number.parseInt

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
        element.addEventListener(event, function handler() {
            element.removeEventListener(event, handler)
            resolve()
        })
    })
}

export async function waitForAny(...events) {
    /*
       Each event is described as an array:
        ["event-string", eventElement, optionalReturnValue]

       Output - Promise with optional return value of first event
    */

    const registered = []
    const promises = []

    // Register events
    for (const event of events) {
        const [eventStr, element, retVal] = event

        promises.push(new Promise(resolve => {
            const handler = () => resolve(retVal)

            element.addEventListener(eventStr, handler)
            registered.push([element, eventStr, handler])
        }))
    }

    // Wait for first event
    const retVal = await Promise.any(promises)

    // Unregister events
    for (const listener of registered) {
        const [element, eventStr, handler] = listener
        element.removeEventListener(eventStr, handler)
    }

    return retVal
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