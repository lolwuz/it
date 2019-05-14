import io from 'socket.io-client'

export const createMySocketMiddleware = url => {
  const events = [
    'lobby_update',
    'lobby_start',
    'lobby_id',
    'game_update',
    'game_loop',
    'game_end',
    'connect',
    'disconnect'
  ]
  let socket

  return storeAPI => next => action => {
    switch (action.type) {
      case 'START':
        socket = io(url, { transports: ['websocket'] })

        // bind all events to trigger a reducer case.
        for (let i = 0; i < events.length; i++) {
          socket.on(events[i], data => {
            if (data) {
              data = JSON.parse(data)
            }
            storeAPI.dispatch({
              type: events[i],
              payload: data
            })
          })
        }

        break

      case 'SEND_WEBSOCKET_MESSAGE':
        const event = action.payload.event
        const message = action.payload.message

        socket.emit(event, message)
        break

      default:
        break
    }

    return next(action)
  }
}
