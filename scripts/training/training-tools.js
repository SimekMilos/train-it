
export function setNextPhase(objArray, activeIndex, timer) {
    let phase = objArray[activeIndex].next()

    if (!phase) {
        if (activeIndex + 1 == objArray.length) return [null, activeIndex]

        // Move to the next object
        objArray[activeIndex].deactivate()
        activeIndex++
        phase = objArray[activeIndex].activate(timer)
    }

    return [phase, activeIndex]
}