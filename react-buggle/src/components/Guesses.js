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
        const { players, guessed, playerId, gameStarted } = this.props.io

        // render guesses
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

        if (gameStarted && guessed.length > 0) {
            return (
                <div>
                    <div className='begin-card'>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header">
                                        MY GUESSES
                                    </div>
                                    <ul className="list-group guessed">
                                        {renderMyGuesses}
                                    </ul>
                                </div>
                    
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header">
                                        ALL GUESSES
                                    </div>
                                    <ul className="list-group guessed">
                                        {renderGuesses}
                                    </ul>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else return (null)
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
