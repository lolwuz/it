import io from 'socket.io-client'
import { joinRoom } from '../messageTypes'


export const createMySocketMiddleware = url => {
    let socket
    let interval

    return storeAPI => next => action => {
        switch (action.type) {
            case 'LOGIN': 
                const room = action.payload.data.room
                const name = action.payload.data.name

                socket = io('localhost:5000', { transports: ['websocket'] })

                socket.on('connect', () => {
                    console.log('connected to the server')
                    this.socket.emit('join', joinRoom(room, name))
                })
        
                socket.on('lobby_update', data => {
                    this.setState({
                        players: JSON.parse(data),
                        multiplayerStarted: true
                    })
                })
        
                socket.on('lobby_start', data => {
                    this.setState({
                        gameStarted: true
                    })
                    
                    interval = setInterval(() => {this.gameLoop()}, 83);
                    this.makeBoard(data)
                })
        
                socket.on('lobby_id', data => {
                    this.setState({
                        playerId: data
                    })
                })
        
                socket.on('game_update', data => {
                    this.setState({
                        guessed: JSON.parse(data)
                    })
                })
        
                socket.on('game_loop', data => {
                    const parsed_data = JSON.parse(data)
                    this.setState({
                        timeLeft: parsed_data.time,
                        cursors: parsed_data.cursors
                    })
                })
        
                socket.on('game_end', data => {
                    console.log(data)
                    this.setState({
                        scores: JSON.parse(data)
                    })
                })
        
                socket.on('disconnect', () => {
                    console.log('disconnected from the server')
                })

                break
            
            case 'SEND_WEBSOCKET_MESSAGE': 
                const topic = action.payload.data.topic
                const message = action.payload.data.message

                socket.emit(topic, message)

                break
            
            default:
                break
        }

        return next(action)
    }
}
