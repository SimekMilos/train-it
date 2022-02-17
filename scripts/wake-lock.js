
let wakeLock = null

// --- Public ---

export function isSupported() {
    return "wakeLock" in navigator
}

export async function activate() {
    if(!isSupported() || wakeLock) return

    try {
        wakeLock = await navigator.wakeLock.request("screen")
    } catch  {}
}

export async function deactivate() {
    if(!isSupported() || !wakeLock) return

    await wakeLock.release()
    wakeLock = null
}


// --- Private ---

document.addEventListener("visibilitychange", async () => {
    if (!isSupported()) return

    if (wakeLock && document.visibilityState == "visible") {
        try {
            wakeLock = await navigator.wakeLock.request("screen")
        } catch {}
    }
})