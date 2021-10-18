
export function setNextPhase(objArray, activeIndex, timer) {
    let nextPhase = objArray[activeIndex].next()

    if (!nextPhase) {
        // Return null if cannot go next
        if (activeIndex == objArray.length - 1) return [null, activeIndex]

        // Move to the next object
        objArray[activeIndex].deactivate()
        activeIndex++
        nextPhase = objArray[activeIndex].activate(timer)
    }

    return [nextPhase, activeIndex]
}