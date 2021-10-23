
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

export function setPreviousPhase(objArray, activeIndex, timer, obj = null) {
    let previousPhase = objArray[activeIndex].back()

    if (!previousPhase) {
        if (activeIndex == 0) {     // When can't go back
            if (obj) obj.currentTime = 0
            return [null, activeIndex]
        }

        // Move to the previous object
        objArray[activeIndex].deactivate()
        activeIndex--
        previousPhase = objArray[activeIndex].activate(timer)
    }

    return [previousPhase, activeIndex]
}

export function prepareNextExercise(isNext, objArray, activeIndex) {
    let preparing = false

    if (objArray[activeIndex].isLastPhase &&
        activeIndex < objArray.length - 1) {

        preparing = true
        objArray[activeIndex+1].isNext = isNext
    }

    return preparing
}

export function setStyle(obj, phase) {
    if (phase == "set") {
        obj._classList.remove("active-pause")
        obj._classList.add("active-set")
    }

    if (phase == "pause") {
        obj._classList.remove("active-set")
        obj._classList.add("active-pause")
    }

    if (phase == null) {
        obj._classList.remove("active-set", "active-pause")
    }
}