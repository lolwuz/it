export const joinRoom = (room, username) => {
    return {
        room,
        username
    }
}

export const ready = (room, is_ready) => {
    return {
        room,
        is_ready
    }
}

export const wordCheck = (room, word) => {
    return {
        room,
        word
    }
}

export const gameLoop = (room, cursor) => {
    return { 
        room, 
        cursor
    } 
}