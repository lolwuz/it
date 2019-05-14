import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class Scores extends Component {
    /** returns the winner, second ect */
    getPlacement = (i) => {
        if (i === 0)
            return `#${i + 1}st (winner)`
        else if(i === 1)
            return `#${i + 1}nd`
        else
            return `#${i + 1}th`
    }

    render() {
        const { scores } = this.props.io

        // render scores sorted by points
        let renderScores = []
            .concat(scores)
            .sort((a, b) => a.points > b.points)
            .map((score, i)=> {
                return (
                    <div key={i}>
                        <div>
                            <div className="alert alert-success">{ this.getPlacement(i)} { score.name } ({ score.points } points)</div>
                        </div>
                    </div>
                )
            })

        return (
            <div>
                { renderScores }
                
                <div className="card-footer"><Link to={`/scores/${this.props.game_code}`}>Scoreboard</Link></div>
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
)(Scores)
