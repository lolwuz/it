import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { getWordCheck, getSolution, deleteBoard } from '../actions/boardActions'
import { message } from '../actions/socketEvents'
import Guesses from '../components/Guesses';
import io from 'socket.io-client';

const joinRoom = (room, username) => {
    return {
        room,
        username
   };
};

const ready = (room, is_ready) => {
    return {
        room,
        is_ready
   };
};

class Game extends Component {
    state = {
        letters: [],
        selected: [],
        boardArray: [],
        return: false,
        timeLeft: 60,
        name: '',

        players: [],
        multiplayerStarted: false,
        gameStarted: false
    }

    componentDidMount() {
        const boardString = this.props.board.board.board
        if (this.props.board.board.game_code.length > 0) {
            // this.makeBoard(boardString)
        } else {
            this.goBack()
        }
    }

    componentWillUnmount() {
        this.ws = null
    }

    handleChange = (event) => {
        let name = event.target.value;
        this.setState({ name: name });
    }

    startMultiplayer = () => {
        let room = this.props.board.board.game_code;
        let name = this.state.name

        this.socket = io('http://localhost:5000');

        this.socket.on('connect', () => {
            console.log('connected: emitting room')
            this.socket.emit('join', joinRoom(room, name))
        });

        this.socket.on('game_update', (data) => {
            console.log(JSON.parse(data))
            this.setState({
                players: JSON.parse(data),
                multiplayerStarted: true
            })
        });

        this.socket.on('game_start', (data) => {
            console.log(data)
            this.setState({
                gameStarted: true
            })

            this.makeBoard(data)
        });

        this.socket.on('disconnect', () => {
            console.log('disconnected from the server')
        });
    }

    readyClick = () => {
        this.socket.emit('ready', ready(this.props.board.board.game_code, true))
    }

    /** Returns to route home and deletes board */
    goBack = () => {
        this.props.deleteBoard();
        this.setState({
            return: true
        });
    }

    /** Convert the board string to a workable 2D array */
    makeBoard = (boardString) => {
        const { board } = this.props.board

        let letters = []
        let boardArray = []

        // Fill letters array.
        for (let i = 2; i < boardString.length; i = i + 5) {
            letters.push(board.board[i])
        }

        // Letters in 2D array for rendering
        let cells = [];
        for (let i = 1; i <= letters.length; i++) {
            cells.push(letters[i - 1]);
            if ((i % 4) === 0) {
                boardArray.push(cells)
                cells = []
            }
        }

        this.setState({
            letters: letters,
            boardArray: boardArray
        });
    }

    /** On hover effect for the text in table */
    onHover = (event, x, y) => {
        let index = (x * 4) + y;

        this.setState({
            lastPosition: index
        });

        // Add selected to selected list if mouse is down.
        if (this.isInbound(index) && !this.state.selected.includes(index) && event.buttons === 1) {
            this.setState({
                selected: [...this.state.selected, index]
            })
        }
    }

    /** Gets the class of the td (for hover/selected effect) */
    getTdClass = (x, y) => {
        let index = (x * 4) + y;

        // if in selected list return selected class
        if (this.state.selected.includes(index))
            return 'selected'

        // if last hovered
        if (this.state.lastPosition === index) {
            return 'hover'
        }

        // Return no class
        return ''
    }

    /**
   * checks if last board position can be reached.
   * @param boardPosition index of last board position
   */
    isInbound = (boardPosition) => {
        let { selected } = this.state
        if (selected.length < 1) { return true }

        let lastPosition = selected[selected.length - 1];
        let index2D = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]];

        let adj = [];
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

        if (adj.includes(lastPosition)) { return true } else { return false }
    }

    /** Checks if word is correct after mouseUp*/
    mouseUp = () => {
        let { selected, letters, gameOver } = this.state;

        if (gameOver) {
            this.setState({
                selected: []
            })
            return // Game ended
        }

        let word = ''

        for (let i = 0; i < selected.length; i++) {
            let index = selected[i]
            word += letters[index] // Append letter to string
        }

        if (word.length > 2) {
            this.props.getWordCheck(this.props.board.board.game_code, word)
        }

        this.setState({
            selected: []
        })
    }

    /** Timer button is clicked.  */
    onClickStart = () => {
        this.startTimer();
    }

    /** Starts a new timer interval */
    startTimer = () => {
        this.setState({
            interval: setInterval(() => {
                if (this.state.timeLeft > 0) {
                    this.setState({
                        timeLeft: this.state.timeLeft - 1
                    })
                }
                else {
                    this.endGame();
                }
            }, 1000)
        })
    }

    /** Clears timer interval and solves the board */
    endGame = () => {
        clearInterval(this.state.interval); // Clears the timer interval
        this.props.getSolution(this.props.board.board.game_code);

        this.setState({
            gameOver: true
        })
    }

    render() {
        const { boardArray, players, multiplayerStarted, name } = this.state
        const { board, check } = this.props

        const renderBoard = boardArray.map((cells, x) =>
            <tr key={x}>
                {
                    cells.map((cell, y) =>
                        <td key={y} className={this.getTdClass(x, y)}><div className="table-text" onMouseMove={(e) => this.onHover(e, x, y)}>{cell}</div></td>
                    )
                }
            </tr>
        )

        const renderPlayers = players.map((player) => 
            <div key={player.player_id} className={player.is_ready ? 'alert alert-success' : 'alert alert-danger'}>
                { player.name } 
            </div>
        )

        // Redirect if no board is loaded
        if (!this.props.board.board || this.state.return) {
            return <Redirect to='/' />
        }

        return (
            <div className="container" onMouseUp={this.mouseUp}>
                <div className="row">
                    <div className="col-md-5">
                        <div className="card begin-card">
                            <div className="card-header">
                                <Link to="/">
                                    <button type="button" className="btn btn-outline-warning btn-block" onClick={this.goBack}>Return</button>
                                </Link>
                            </div>
                            <div className="card-body">
                                <h5>Game code: {board.board.game_code} </h5>
                                <h6>Total points scored: {check.points}   </h6>
                                {this.state.timeLeft === 60 && <button className="btn btn-outline-success btn-block" onClick={this.onClickStart}>Start timer</button>}
                            </div>
                        </div>

                        <div className="card begin-card">
                            <div className="card-body">
                                { (this.state.name.length > 3 && !multiplayerStarted) && <button className="btn btn-outline-success btn-block" onClick={this.startMultiplayer}>Enter multiplayer</button> } {" - "} { name }
                                { !multiplayerStarted && <input value={this.state.name} onChange={this.handleChange} type="text" className="form-control" id="inlineFormInputName"
                                placeholder="Name" /> }

                                { multiplayerStarted && <button className="btn btn-sm btn-outline-success" onClick={this.readyClick}>Ready</button>}
                                { renderPlayers } 
                            </div>
                        </div>
                        <div>
                            <h1 id="timer" className="text-center">{this.state.timeLeft > 0 ? this.state.timeLeft : "Game over!"}</h1>
                        </div>
                    </div>

                    <div className="col-md-7">
                        <table id="game-table" className="table-bordered">
                            <tbody id="game-table-body">
                                { renderBoard }
                            </tbody>
                        </table>
                        <Guesses />
                    </div>
                </div>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        board: state.board,
        check: state.check
    }
}

const mapDispatchToProps = dispatch => ({
    getWordCheck: (game_code, word) => dispatch(getWordCheck(game_code, word)),
    getSolution: (game_code) => dispatch(getSolution(game_code)),
    deleteBoard: () => dispatch(deleteBoard())
})

export default connect(mapStateToProps, mapDispatchToProps)(Game)
