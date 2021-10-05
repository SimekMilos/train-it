
import * as settings from "../settings/settings.js"

//TODO - edit in screens.js if it should be called when traininData == null

export function init(trainingData) {

}

export function destroy() {

}

export function display() {

}

const settingsButton = document.querySelector(".ts-settings")

settingsButton.addEventListener("click", onSettingsClick)

async function onSettingsClick() {
    const ret = await settings.open()
    log("Return value: " + ret)
}