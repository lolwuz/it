import React, { Component } from 'react'
import { connect} from 'react-redux'
import {  Redirect } from 'react-router-dom'
import { getBoard, postBoard } from '../actions/boardActions'

class Home extends Component {
    state = {
        game_code: '',
        gameFound: 'disabled'
    }

    handleChange = (event) => {
        let code = event.target.value;
        this.setState({ game_code: code });

        if (code.length === 6) {
            this.props.getBoard(code);
        }
    }

    randomGame = () => {
        this.props.postBoard();

        this.setState({
            randomGame: true
        });
    }

    render() {
        if (this.props.board.board.game_code.length > 0) { return (<Redirect to="/game"/>)}

        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div id="start-card" className="card">
                            <div className="card-header">
                                <h1 className="text-center">Buggle React</h1>
                            </div>

                            <div className="card-body">
                                <img alt="react-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png" className="img-fluid" />
                             
                                <label className="sr-only" htmlFor="inlineFormInputName">Name</label>
                                <input value={this.state.game_code} onChange={this.handleChange} type="text" className="form-control" id="inlineFormInputName"
                                    placeholder="Game code" />
                                  
                            </div>

                            <div className="card-footer">
                                <button className="btn btn-outline-success btn-block" onClick={this.randomGame}>play a random game</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        board: state.board
    }
}

const mapDispatchToProps = dispatch => ({
    getBoard: (game_code) => dispatch(getBoard(game_code)),
    postBoard: () => dispatch(postBoard())
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
