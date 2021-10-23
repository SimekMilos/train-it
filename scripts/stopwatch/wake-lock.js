
let wakeLock = null

// --- Public ---


export async function activate() {
    if(!("wakeLock" in navigator) || wakeLock) return

    try {
        wakeLock = await navigator.wakeLock.request("screen")
    } catch  {}
}

export async function deactivate() {
    if(!("wakeLock" in navigator) || !wakeLock) return

    await wakeLock.release()
    wakeLock = null
}


// --- Private ---

document.addEventListener("visibilitychange", async () => {
    if (!("wakeLock" in navigator)) return

    if (wakeLock && document.visibilityState == "visible") {
        try {
            wakeLock = await navigator.wakeLock.request("screen")
        } catch {}
    }
})