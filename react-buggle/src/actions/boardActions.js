/*  Board Actions */
export function getBoard(game_code) {
  return {
    types: ['R_BOARD', 'S_BOARD', 'F_BOARD'],
    payload: {
      request: {
        url: `/board/${game_code}`
      }
    }
  }
}

export function postBoard() {
  return {
    types: ['R_NEW_BOARD', 'S_NEW_BOARD', 'F_NEW_BOARD'],
    payload: {
      request: {
        url: `/board`,
        method: 'POST',
      }
    }
  }
}

export function deleteBoard() {
  return { 
    type: 'DELETE_BOARD'
  }
}

export function getWordCheck(game_code, word) {
  return {
    types: ['R_BOARD_CHECK', 'S_BOARD_CHECK', 'F_BOARD_CHECK'],
    payload: {
      request: {
        url: `/board/${game_code}/check/${word}`
      },
    }
  }
}

export function getSolution(game_code) {
  return {
    types: ['R_BOARD_SOLUTION', 'S_BOARD_SOLUTION', 'F_BOARD_SOLUTION'],
    payload: {
      request: {
        url: `/board/solution/${game_code}`

      },
    }
  }
}