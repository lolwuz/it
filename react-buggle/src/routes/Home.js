import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { getBoard, postBoard } from '../actions/boardActions'

class Home extends Component {
  state = {
    game_code: '',
    gameFound: 'disabled'
  }

  /** code input event */
  handleChange = event => {
    let code = event.target.value
    this.setState({ game_code: code })

    if (code.length === 6) {
      this.props.getBoard(code)
    }
  }

  /** starts a random game by posting a new board */
  randomGame = () => {
    this.props.postBoard()

    this.setState({
      randomGame: true
    })
  }

  render() {

    if (this.props.board.boardLoaded) {
      return <Redirect to={`/game/${this.props.board.board.game_code}`} />
    }

    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div id="start-card" className="card">
              <div className="card-header">
                <h1 className="text-center">Buggle React</h1>
              </div>

              <div className="card-body">
                <img
                  alt="react-logo"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png"
                  className="img-fluid"
                />

                <input
                  value={this.state.game_code}
                  onChange={this.handleChange}
                  type="text"
                  className="form-control"
                  id="game_code"
                  placeholder="Game code"
                />
              </div>

              <div className="card-footer">
                <button
                  className="btn btn-outline-success btn-block"
                  onClick={this.randomGame}
                >
                  play a random game
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    board: state.board
  }
}

const mapDispatchToProps = dispatch => ({
  getBoard: game_code => dispatch(getBoard(game_code)),
  postBoard: () => dispatch(postBoard())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
