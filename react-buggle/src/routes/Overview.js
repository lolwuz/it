import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getScores, getSolution } from '../actions/boardActions'
import { Link } from 'react-router-dom'

class Overview extends Component {
  componentDidMount() {
    const game_code = this.props.match.params.game_code

    // get scores for the board
    this.props.getScores(game_code)

    // get solution for the board
    this.props.getSolution(game_code)
  }

  //* return score for length of word */
  getWordScore = (word) => {
    let length = word.length
    if (length >= 8)
        return 11
    if (length === 7)
        return 5
    if (length === 6)
        return 3
    if (length === 5)
        return 2
    else 
        return 1
  }

  render() {
    const game_code = this.props.match.params.game_code

    const { solutions, totalPoints } = this.props.check
    const { score } = this.props.scores

    // render scores sorted by highest
    const renderScores = []
      .concat(score)
      .sort((a, b) => a.score > b.score)
      .map((score, i) => (
        <div key={i} className="alert alert-info">
          {score.name}{' '}
          <span className="float-right">({score.score} points)</span>
        </div>
      ))


    // render words sorted by length
    const renderWords = []
      .concat(solutions)
      .sort((a, b) => b.length - a.length)
      .map((word, i) => (
        <div key={i} className="alert alert-solved">
            {word}
            <span className="float-right">{this.getWordScore(word)}</span>
        </div>
      ))

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="card begin-card">
              <div className="card-header">
                <h1 className="card-title">Game</h1>
              </div>
              <div className="card-body">
                <p className="card-text">CODE: {game_code}</p>
              </div>
              <div className="card-footer">
                <Link to="/">Back</Link>
              </div>
            </div>

            <div className="card begin-card">
              <div className="card-header">
                <h1 className="card-title">Scores</h1>
              </div>

              {renderScores}
            </div>
          </div>
          <div className="col-md-8">
            <div id="solved-card" className="card">
              <div className="card-header">
                <h1 className="card-title">
                  Words
                  <span className="float-right">
                    (total points: {totalPoints})
                  </span>
                </h1>
              </div>
              <div id="solved-words">{renderWords}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    scores: state.scores,
    check: state.check
  }
}

const mapDispatchToProps = dispatch => ({
  getScores: game_code => dispatch(getScores(game_code)),
  getSolution: game_code => dispatch(getSolution(game_code))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview)
