/*
 src/reducers/boardReducer.js
*/
export default (state = { loading: false, board: { game_code: ''} }, action) => {
    switch (action.type) {
        case 'DELETE_BOARD':
            return { ...state, loading: false, board: { game_code: ''}}
        
        case 'R_BOARD':
            return { ...state, loading: true }
        case 'S_BOARD':
            return { ...state, loading: false, board: action.payload.data }
        case 'F_BOARD':
            return { ...state, loading: false, error: 'Error while fetching board' }

        case 'R_NEW_BOARD':
            return { ...state, loading: true }
        case 'S_NEW_BOARD':
            return { ...state, loading: false, board: action.payload.data }
        case 'F_NEW_BOARD':
            return { ...state, loading: false, error: 'Error while fetching board' }

        default:
            return state

    }
}