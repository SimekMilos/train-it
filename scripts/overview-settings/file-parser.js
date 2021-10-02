
import {range} from "../tools.js"


// --- Public ---

export class ParserError extends Error {
    constructor(message) {
        super(message)
        this.name = "ParserError"
    }
}

export function parseFile(data) {
    // Parse storage structure
    try {
        data = JSON.parse(data)
        for (const key in data) data[key] = JSON.parse(data[key])
    } catch {
        throw new ParserError
    }

    // Test order array
    if (!checkOrderArray(data)) throw new ParserError

    // Parse trainings
    for (const trID of data["training-order"]) {
        if (!parseTraining(data[trID])) {
            throw new ParserError
        }
    }

    return data
}


// --- Private ---

function checkOrderArray(data) {
    const orderArray = data["training-order"]

    // Check array
    if (!(orderArray instanceof Array)) return false
    if (!orderArray.length) return false

    // Check ids
    for (const id of orderArray) {
        if (typeof id != "string") return false
        if (!id.trim().length) return false

        // check arr id - training id bindings
        if (!(data[id] instanceof Object)) return false
    }

    return true
}

function parseTraining(training) {
    if (!parseName(training)) return false
    if (!parseNotes(training)) return false
    if (!testObjectArray(training.groups)) return false
    if (!parseSettings(training.settings)) return false

    // Parse groups
    for (const group of training.groups) {
        if (!parseGroup(group)) return false
    }

    return true
}

function parseGroup(group) {
    if (group.type != "group" && group.type != "no-group") return false

    if (group.type == "group") {
        if (!parseName(group)) return false
        if (!parseNotes(group)) return false
    }
    if (!testObjectArray(group.exercises)) return false

    // Parse exercises
    for (const exercise of group.exercises) {
        if (!parseExercise(exercise)) return false
    }

    return true
}

function parseExercise(exercise) {
    if (!parseName(exercise)) return false
    if (!parseNotes(exercise)) return false

    // Parse sets
    const sets = exercise.sets
    if (!(sets instanceof Array)) return false
    if (!sets.length) return false         // Must have at least 1 set

        // Trim sets
    for (const index of range(sets.length)) {
        if (typeof sets[index] == "string") {
            sets[index] = sets[index].trim()
        }
    }

        // Test set values - null or non-empty string
    for (const set of sets) {
        if (set !== null && typeof set != "string") return false
        if (typeof set == "string" && !set.length) return false
    }

    return true
}

function parseSettings(settingsObj) {
    // settings dont have to be defined
    if (settingsObj === undefined) return true

    if (!(settingsObj instanceof Object)) return false

    //TODO: add tests acording to settings definition and test it
    //  - if there are no edits to settingsObj, rename to checkSettings

    return true
}




function parseName(obj) {
    if (typeof obj.name != "string") return false
    obj.name = obj.name.trim()

    // Name cannot be empty
    if (!obj.name.length) return false
    return true
}

function parseNotes(obj) {
    if (typeof obj.notes != "string") return false
    obj.notes = obj.notes.trimEnd()

    return true
}

function testObjectArray(array) {
    if (!(array instanceof Array)) return false
    if (!array.length) return false             // at least 1 group in training
                                                // at least 1 exercise in group
    for (const obj of array) {
        if (!(obj instanceof Object)) return false
    }

    return true
}