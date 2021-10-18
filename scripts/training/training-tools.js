
export function setNextPhase(objArray, activeIndex, timer) {
    let phase = objArray[activeIndex].next()

    if (!phase) {
        if (activeIndex == objArray.length - 1) return [null, activeIndex]

        // Move to the next object
        objArray[activeIndex].deactivate()
        activeIndex++
        phase = objArray[activeIndex].activate(timer)
    }

    return [phase, activeIndex]
}