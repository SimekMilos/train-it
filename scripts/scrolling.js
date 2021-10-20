
import {px, float, wait} from "./tools.js"


export async function smoothScroll(distance, duration, scrollContainer,
                                   horizontal = false) {
    /* Scrolls container vertically or horizontally.
        distance - Number in px
            - positive - to the bottom/right
            - negative - up/left
        duration - in ms
        horizontal - false = vertical scrolling, true = horizontal scrolling
    */

    let contentLenght, scrolled, clientLength

    // Get dimensions
    if (horizontal) {
        contentLenght = scrollContainer.scrollWidth
        scrolled = scrollContainer.scrollLeft
        clientLength = scrollContainer.clientWidth
    } else {
        contentLenght = scrollContainer.scrollHeight
        scrolled = scrollContainer.scrollTop
        clientLength = scrollContainer.clientHeight
    }

    // Cap by maximum possible scrolling distance
    if (distance > 0) {
        const maxScrollEnd = contentLenght - scrolled - clientLength
        distance = Math.min(distance, maxScrollEnd)
    } else {
        distance = Math.max(distance, -scrolled)
    }

    // Setup values for scrolling
    const stop = scrolled + distance
    const step = 8 * distance/duration

    // Scroll
    scrolled += step
    while (distance > 0 ? scrolled < stop : scrolled > stop) {

        if (horizontal) scrollContainer.scrollLeft = scrolled
        else            scrollContainer.scrollTop = scrolled

        await wait(8)       // 120 fps
        scrolled += step
    }

    if (horizontal) scrollContainer.scrollLeft = scrolled
    else            scrollContainer.scrollTop = scrolled
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