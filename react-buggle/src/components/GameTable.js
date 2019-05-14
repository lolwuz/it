import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getWordCheck } from '../actions/boardActions'
import { send, updateSelected } from '../actions/ioActions'
import { wordCheck } from './../messageTypes';
import { clearSelected } from './../actions/ioActions';

class GameTable extends Component  {
    state = {
        lastPosition: 0
    }

     /** On hover effect for the text in table */
     onHover = (event, x, y) => {
        let { selected } = this.props.io
        let index = x * 4 + y

        this.setState({
            lastPosition: index
        })

        // Add selected to selected list if mouse is down.
        if (
            this.isInbound(index) &&
            !selected.includes(index) &&
            event.buttons === 1
        ) {
            this.props.updateSelected(index)
        }
    }

     /** Checks if word is correct after mouseUp*/
     onMouseUp = () => {
        let { gameOver } = this.state
        let { letters, selected } = this.props.io

        if (gameOver) {
            this.props.clearSelected()
            return // Game ended
        }

        let word = ''

        for (let i = 0; i < selected.length; i++) {
            let index = selected[i]
            word += letters[index] // Append letter to string
        }
      
        if(word.length > 1)
            this.props.send('check_word', wordCheck(this.props.board.board.game_code, word))
        
        this.props.clearSelected()
    }

    /**
     * checks if last board position can be reached.
     * @param boardPosition index of last board position
     */
    isInbound = (boardPosition) => {
        let { selected } = this.props.io
        if (selected.length < 1) {
            return true
        }

        let lastPosition = selected[selected.length - 1]
        let index2D = [
            [0, 1, 2, 3],
            [4, 5, 6, 7],
            [8, 9, 10, 11],
            [12, 13, 14, 15]
        ]

        let adj = []
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                if (index2D[x][y] === boardPosition) {
                    for (let c = -1; c <= 1; c++) {
                        for (let j = -1; j <= 1; j++) {
                            let xc = x + c
                            let yj = y + j
                            if (xc >= 0 && xc <= 3 && yj >= 0 && yj <= 3)
                                adj.push(index2D[xc][yj])
                        }
                    }
                }
            }
        }

        if (adj.includes(lastPosition)) {
            return true
        } else {
            return false
        }
    }

    /** Gets the class of the td (for hover/selected effect) */
    getTdClass = (x, y, cursors, playerId) => {
        let { selected } = this.props.io
        let index = x * 4 + y

        let className = 'empty'
        // if in selected list return selected class
        if (selected.includes(index)) {
            className = 'selected'
        }

        // if last hovered
        if (this.state.lastPosition === index) {
            className = 'hover'
        }

        for (let i = 0; i < cursors.length; i++) {
            const indexes = cursors[i].cursor;

            if (cursors[i].player_id !== playerId) {
                for (let y = 0; y < indexes.length; y++) {
                    if (indexes[y] === index ) {
                        className = className + '-enemy'
                    }
                }
            }
        }

        // Return no class
        return className 
    }

    render () {
        const { cursors, boardArray, playerId  } = this.props.io

        const renderBoard = boardArray.map((cells, x) => (
            <tr key={x}>
                {cells.map((cell, y) => (
                    <td key={y} className={this.getTdClass(x, y, cursors, playerId)}>
                        <div
                            className="table-text"
                            onMouseMove={e => this.onHover(e, x, y)}
                        >
                            {cell}
                        </div>
                    </td>
                ))}
            </tr>
        ))
        
        return (
            <table
                id="game-table"
                className="table-bordered"
                onMouseUp={this.onMouseUp}
            >
                <tbody id="game-table-body" className="card">
                    {renderBoard}
                </tbody>
            </table>
        )
    }
}

const mapStateToProps = state => {
    return {
        board: state.board,
        io: state.io
    }
}

const mapDispatchToProps = dispatch => ({
    getWordCheck: (game_code, word) => dispatch(getWordCheck(game_code, word)),
    send: (event, message) => dispatch(send(event, message)),
    updateSelected: (selected) => dispatch(updateSelected(selected)),
    clearSelected: () => dispatch(clearSelected())
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GameTable)
