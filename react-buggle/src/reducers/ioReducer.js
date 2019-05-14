/*
 src/reducers/boardReducer.js
*/
import { makeBoard, defaultState } from './helpers';


export default (state = defaultState, action) => {
    // payload of action
    const payload = action.payload
    // switch lobby, game and connection events. 
    switch (action.type) {
        // lobby 
        case 'lobby_update':   
            return { ...state, players: payload }
        case 'lobby_start':
            const board = makeBoard(payload)
            return { ...state, gameStarted: true, boardArray: board[0], letters: board[1]  }
        case 'lobby_id':
            return { ...state, playerId: payload.player_id }

        // game related
        case 'game_update':
            return { ...state, guessed: payload }
        case 'game_loop':
            return { ...state, timeLeft: payload.time, cursors: payload.cursors }
        case 'game_end':
            return { ...state, scores: payload }

        // helpers
        case 'update_selected':
            return { ...state, selected: [...state.selected, payload]}
        case 'clear_selected':
            return { ...state, selected: []}
        case 'clear_game':
            return defaultState

        // connection
        case 'connect':
            console.log('connected to the server')
            return { ...state }
        case 'disconnect':
            console.log('disconnected from the server')
            return { ...state }
        default:
            return state
    }
}