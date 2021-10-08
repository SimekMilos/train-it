
const currentWatch = document.querySelector(".st-current-stopwatch")
const totalWatch = document.querySelector(".st-total-stopwatch")

let currentWatchTime = 0
let totalWatchTime = 0


export function addToCurrentWatch() {
    currentWatchTime++

    let seconds = currentWatchTime % 60
    let minutes = ((currentWatchTime - seconds) / 60) % 60
    seconds = String(seconds).padStart(2, "0")
    minutes = String(minutes).padStart(2, "0")

    currentWatch.textContent = `${minutes}:${seconds}`
}

export function addToTotalWatch() {
    totalWatchTime++

    let seconds = currentWatchTime % 60
    let minutes = ((currentWatchTime - seconds) / 60) % 60
    let hours = ((totalWatchTime - minutes*60 - seconds) / 3600 ) % 24
    seconds = String(seconds).padStart(2, "0")
    minutes = String(minutes).padStart(2, "0")
    hours = String(hours).padStart(2, "0")

    totalWatch.textContent = `${hours}:${minutes}:${seconds}`
}

export function resetCurrentWatch() {
    currentWatchTime = 0
    currentWatch.textContent = "00:00"
}

export function resetTotalWatch() {
    totalWatchTime = 0
    totalWatch.textContent = "00:00:00"
}