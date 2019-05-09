export function message(eventName, data) {
    return JSON.stringify([eventName, data])
}