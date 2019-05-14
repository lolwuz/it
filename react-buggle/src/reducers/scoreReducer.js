/*
 src/reducers/boardReducer.js
*/
export default (state = { loading: false, score: [], points: 0, solved: []}, action) => {
    switch (action.type) {
        case 'DELETE_SCORE':
            return { ...state, loading: false, score: [], points: 0, solved: []}
        
        case 'R_SCORE':
            return { ...state, loading: true }
        case 'S_SCORE':
            return { ...state, loading: false, score: action.payload.data }
        case 'F_SCORE':
            return { ...state, loading: false, error: 'Error while fetching score' }

        default:
            return state

    }
}