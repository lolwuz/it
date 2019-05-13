import React, { Component } from 'react'
import { connect } from 'react-redux'

class Guesses extends Component {
    /** Returns the class for guess */
    getClass = (points) => {
        if (points === 0) {
            return 'list-group-item-danger'
        } else {
            return 'list-group-item-success'
        }
    }

    render() {
        const { players, guessed, playerId } = this.props.io

        let renderGuesses = guessed.map((guess, index) => {
            let name = 'unnamed'
            for (let i = 0; i < players.length; i++) {
                if (players[i].player_id === guess.player_id) {
                    name = players[i].name
                }
            }

            return (
                <li
                    key={index}
                    className={
                        'list-group-item ' +
                        this.getClass(guess.points)
                    }
                >
                    {guess.points + ' - ' + guess.word + '  (' + name + ')'}
                </li>
            )
        })

        let renderMyGuesses = guessed.map((guess, index) => {
            let name = 'unnamed'
            for (let i = 0; i < players.length; i++) {
                if (players[i].player_id === guess.player_id) {
                    name = players[i].name
                }
            }

            if (guess.player_id === playerId) {
                return (
                    <li
                        key={index}
                        className={
                            'list-group-item ' +
                            this.getClass(guess.points)
                        }
                    >
                        {guess.points + ' - ' + guess.word + '  (' + name + ')'}
                    </li>
                ) 
            } else return (null)
        
        })

        return (
            <div>
                <div id="guesses">
                    <div className="row">
                        <div className="col-md-6">
                            <ul className="list-group">
                                {renderMyGuesses}
                            </ul>
                        </div>
                        <div className="col-md-6">
                            <ul className="list-group">
                                {renderGuesses}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        io: state.io
    }
}

export default connect(
    mapStateToProps,
    null
)(Guesses)
