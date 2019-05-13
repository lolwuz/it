/** Convert the board string to a workable 2D array */
export const makeBoard = boardString => {
    let letters = []
    let boardArray = []

    // Fill letters array.
    for (let i = 2; i < boardString.length; i = i + 5) {
        letters.push(boardString[i])
    }

    // Letters in 2D array for rendering
    let cells = []
    for (let i = 1; i <= letters.length; i++) {
        cells.push(letters[i - 1])
        if (i % 4 === 0) {
            boardArray.push(cells)
            cells = []
        }
    }

    return [boardArray, letters]
}

/* Default state of game */
export const defaultState = {
    players: [],
    guessed: [],
    scores: [],
    cursors: [],
    boardArray: [],
    letters: [],
    selected: [],
    gameStarted: false,
    timeLeft: 60,
    playerId: ''
}