/*  Board Actions */
export function start() {
    return {
        type: 'START'
    }
}

export function updateSelected(selected) {
    return {
        type: 'update_selected',
        payload: selected
    }
}

export function clearSelected() {
    return {
        type: 'clear_selected'
    }
}

export function clearGame() {
    return {
        type: 'clear_game'
    }
}

export function send (event, message) {
    return {
        type: 'SEND_WEBSOCKET_MESSAGE',
        payload: {
            event: event,
            message: message
        }
    }
}