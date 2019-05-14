import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getWordCheck, getSolution, deleteBoard } from '../actions/boardActions'
import { start, send, clearGame } from '../actions/ioActions'
import { ready, joinRoom, gameLoop } from '../messageTypes'

import Guesses from '../components/Guesses'
import GameTable from '../components/GameTable'
import Scores from '../components/Scores'

class Game extends Component {
  state = {
    name: '',
    multiplayerStarted: false,
    return: false
  }

  /** clear timer on unmount */
  componentWillUnmount() {
    clearInterval(this.interval)
  }

  /** handles input change on the name input */
  handleChange = event => {
    let name = event.target.value
    this.setState({ name: name })
  }

  /** returns to route home and deletes board */
  goBack = () => {
    this.props.deleteBoard() // delete board. Otherwise we will be redirected again
    this.props.clearGame()
    this.setState({
      return: true
    })
  }

  /** send ready message to the server */
  readyClick = () => {
    this.props.send('ready', ready(this.props.board.board.game_code, true))
  }

  /** join the multiplayer server */
  startMultiplayer = () => {
    let room = this.props.board.board.game_code
    let name = this.state.name

    this.props.start()
    this.props.send('join', joinRoom(room, name))

    this.interval = setInterval(() => {
      this.gameLoop()
    }, 83)

    this.setState({
      multiplayerStarted: true
    })
  }

  /** interval gameloop emitter */
  gameLoop = () => {
    this.props.send(
      'game_loop',
      gameLoop(this.props.board.board.game_code, this.props.io.selected)
    )
  }

  render() {
    const { multiplayerStarted, name } = this.state
    const { board, check } = this.props
    const { players, timeLeft, gameStarted } = this.props.io

    // check how many players are ready
    let readyPlayers = 0
    for (let i = 0; i < players.length; i++) {
      if (players[i].is_ready) readyPlayers++
    }

    // list of players
    const renderPlayers = players.map(player => (
      <div
        key={player.player_id}
        className={
          player.is_ready ? 'alert alert-success' : 'alert alert-danger'
        }
      >
        {player.name}
      </div>
    ))

    // Redirect to home
    if (this.state.return || !this.props.board.boardLoaded)
      return <Redirect to="/" />

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <div className="card begin-card">
              <div className="card-header">
                <button
                  type="button"
                  className="btn btn-outline-warning btn-block"
                  onClick={this.goBack}
                >
                  Return
                </button>
              </div>
              <div className="card-body">
                <h5>Game code: {board.board.game_code} </h5>
                <h6>Total points scored: {check.points} </h6>
              </div>
            </div>

            <div className="card begin-card">
              <div className="card-body">
                {!multiplayerStarted && name.length > 2 && (
                  <button
                    className="btn btn-outline-success btn-block"
                    onClick={this.startMultiplayer}
                  >
                    Join game
                  </button>
                )}

                {!multiplayerStarted && (
                  <input
                    value={name}
                    onChange={this.handleChange}
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Name"
                  />
                )}

                {multiplayerStarted && !gameStarted && (
                  <button
                    className="btn btn-outline-success btn-block"
                    onClick={this.readyClick}
                  >
                    Ready - ({readyPlayers}/{players.length})
                  </button>
                )}
                {gameStarted && (
                  <h1 id="timer" className="text-center">
                    {timeLeft > 0 ? timeLeft : 'Game over!'}
                  </h1>
                )}
              </div>

              {renderPlayers}
              <Scores game_code={this.props.match.params.game_code}/>
            </div>
          </div>

          <div className="col-md-7">
            <GameTable />
            <Guesses/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    board: state.board,
    check: state.check,
    io: state.io
  }
}

const mapDispatchToProps = dispatch => ({
  getWordCheck: (game_code, word) => dispatch(getWordCheck(game_code, word)),
  getSolution: game_code => dispatch(getSolution(game_code)),
  deleteBoard: () => dispatch(deleteBoard()),
  start: () => dispatch(start()),
  send: (event, message) => dispatch(send(event, message)),
  clearGame: () => dispatch(clearGame())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game)
