import React, { Component } from 'react'
import { connect } from 'react-redux'

class Guesses extends Component {
    getClass = (player_id, points) => {}

    render() {
        const { players } = this.props

        console.log(players)
        console.log(this.props.guessed)

        let guesses = this.props.guessed.map((guess, index) => {
            let name = 'deceased'
            for (let i = 0; i < players.length; i++) {
                if (players[i].player_id === guess.player_id) {
                    name = players[i].name
                }
            }

            return (
                <div
                    key={index}
                    className={
                        'alert ' + this.getClass(guess.player_id, guess.points)
                    }
                >
                    {guess.word + '  (' + name + ')'}
                </div>
            )
        })

        return (
            <div>
                <div id="guesses" className="row">
                    <div className="col-md-6">{guesses}</div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        check: state.check
    }
}

export default connect(
    mapStateToProps,
    null
)(Guesses)
