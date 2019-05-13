import React, { Component } from 'react'
import { connect } from 'react-redux'

class Scores extends Component {
    /** returns the winner, second ect */
    getPlacement = (points) => {
        const { scores } = this.props.io

        let maxScore = 0
        for (let i = 0; i < scores.length; i++) {
            if (scores[i].points > maxScore)
                maxScore = scores[i].points
        }

        if (maxScore === points)
            return 'winner'
        else
            return 'looser'
    }

    render() {
        const { scores, playerId } = this.props.io

        console.log(scores)

        let renderScores = scores.map((score, i)=> {
            let words = score.words.map((word, j) => 
                <div key={j}>{word}</div>
            )

            return (
                <div key={i}>
                    <div>
                  
                        <h1>player: { this.getPlacement(score.points) } score: ({score.points })</h1>
                    
                        
                        <div>
                            { words} 
                        </div>
                    </div>
                </div>
            )
        })

        return (
            <div>
                { renderScores }
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
