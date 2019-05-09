
/*
src/reducers/checkReducer.js
*/
export default (state = { loading: false, guesses: [], solutions: [], points: 0, }, action) => {
    switch (action.type) {
        case 'R_BOARD_CHECK':
            return { ...state, loading: true }
        case 'S_BOARD_CHECK':
            let guess = action.payload.data
            if (!guess.is_valid)
                guess.is_valid = 0
            else
                guess.is_valid = 1
            for (let i = 0; i < state.guesses.length; i++) {
                if (state.guesses[i].word === guess.word) {
                    guess.is_valid = 2
                }
            }
            return { ...state, loading: false, guesses: [guess, ...state.guesses], points: state.points + guess.points }
        case 'F_BOARD_CHECK':
            return { ...state, loading: false, error: 'Error while fetching check' }

        case 'R_BOARD_SOLUTION':
            return { ...state, loading: true }
        case 'S_BOARD_SOLUTION':
            return { ...state, loading: false, solutions: action.payload.data.solved, totalPoints: action.payload.data.points }
        case 'F_BOARD_SOLUTION':
            return { ...state, loading: false, error: 'Error while fetching solution' }
        case 'DELETE_BOARD':
            return { ...state, loading: false, guesses: [], solutions: [], points: 0 }
        default:
            return state
    }
}
