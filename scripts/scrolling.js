
import {px, float, wait} from "./tools.js"


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

export async function smoothVerticalScroll(distance, duration, scrollContainer) {
    /*  distance - Number in px, positive - down, negative - up
        duration - in ms
    */

    // Cap by maximum possible scrolling distance
    if (distance > 0) {
        const maxDown = scrollContainer.scrollHeight
                          - scrollContainer.scrollTop
                          - scrollContainer.clientHeight

        distance = Math.min(distance, maxDown)
    } else {
        const maxUp = scrollContainer.scrollTop
        distance = Math.max(distance, -maxUp)
    }

    // Setup values for scrolling
    let scrolled = scrollContainer.scrollTop
    const stop = scrolled + distance
    const step = 8 * distance/duration

    // Scroll
    while (distance > 0 ? scrolled < stop : scrolled > stop) {
        scrolled += step
        scrollContainer.scrollTop = scrolled
        await wait(8)       // 120 fps
    }

    scrollContainer.scrollLeft = stop
}

export async function smoothHorizontalScroll(distance, duration, scrollContainer) {
    /*  distance - Number in px, positive - to the right, negative - to the left
        duration - in ms
    */

    // Cap by maximum possible scrolling distance
    if (distance > 0) {
        const maxRight = scrollContainer.scrollWidth
                          - scrollContainer.scrollLeft
                          - scrollContainer.clientWidth

        distance = Math.min(distance, maxRight)
    } else {
        const maxLeft = scrollContainer.scrollLeft
        distance = Math.max(distance, -maxLeft)
    }

    // Setup values for scrolling
    let scrolled = scrollContainer.scrollLeft
    const stop = scrolled + distance
    const step = 8 * distance/duration

    // Scroll
    while (distance > 0 ? scrolled < stop : scrolled > stop) {
        scrolled += step
        scrollContainer.scrollLeft = scrolled
        await wait(8)       // 120 fps
    }

    scrollContainer.scrollLeft = stop
}

export function getExtraContainerHeight(scrollContainer) {
    /* Returns height of scroll container unused by its content. */

    // Detect where content ends
    const last = scrollContainer.lastElementChild
    let {bottom: contentEnd} = last.getBoundingClientRect()
    contentEnd += float(getComputedStyle(last).marginBottom)

    // Compute difference to the container
    const {bottom: containerEnd} = scrollContainer.getBoundingClientRect()
    const unusedHeight = containerEnd - contentEnd
    return unusedHeight > 0 ? unusedHeight : 0
}

export function addDynamicPadding(maxHeight, scrollContainer) {
    /* Adds bottom padding to scrolling container as a filler before i.e.
    removing element.
        - Accounts for current scroll and adds only as much as needed.

    maxHeight - maximum padding height to be added
        - i.e. height of the element being removed)

    return - function that smoothly removes said padding in specified
        duration (in ms).
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