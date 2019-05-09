import React, { Component } from 'react'
import { connect } from 'react-redux'

class Guesses extends Component {

    getClass = (validity) => {
        switch(validity) {
            case 0:
                return 'alert-danger'
            case 1:
                return 'alert-success'
            case 2:
                return 'alert-info'
            default:
                break;
        }
    }

    render() {
        let guesses = this.props.check.guesses.map((guess, index) =>
            <div key={index} className={"alert " + this.getClass(guess.is_valid)}  >
                { guess.word } 
            </div>
        )

        let solution = this.props.check.solutions.map((guess, index) =>
            <div key={index} className="alert alert-info">
                { guess } 
            </div>
        )

        return (
            <div>
                <div id="guesses" className="row">
                    <div className="col-md-6">
                        { guesses }
                    </div>
                    <div className="col-md-6">
                        { solution }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        check: state.check
    }
}

export default connect(mapStateToProps, null)(Guesses)
