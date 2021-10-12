
import {wait} from "../tools.js"

const audio = new Audio("../../res/empty.mp3")
let noSleep = null


// --- Public ---

export function activate() {
    if (!noSleep) noSleep = new NoSleep()
}

export function deactivate() {
    if (noSleep) {
        noSleep.stop()
        noSleep = null
    }
}


// --- Private ---

window.addEventListener("click", function enable() {
    window.removeEventListener("click", enable)
    audio.play()
})

class NoSleep {
    constructor() {
        this._noSleep = true
        this._keepAwake()
    }

    stop() {
        this._noSleep = false
    }

    async _keepAwake() {
        while(this._noSleep) {
            audio.play()
            await wait(10000)
        }
    }
}