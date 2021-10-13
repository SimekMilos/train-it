
import {wait} from "../tools.js"

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
    video.play()
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
            video.play()
            await wait(10000)
        }
    }
}

const video = document.createElement("video")
video.setAttribute("playsinline", "")

let source = document.createElement("source")
source.src = "../../res/empty.mp4"
source.type = "video/mp4"
video.append(source)

source = document.createElement("source")
source.src = "../../res/empty.webm"
source.type = "video/webm"
video.append(source)