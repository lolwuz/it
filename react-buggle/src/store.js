/*
 * src/store.js
 * With initialState
*/
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers/rootReducer'
import axios from 'axios'
import axiosMiddleware from 'redux-axios-middleware'
import { createMySocketMiddleware } from './socketMiddleWare';

const client = axios.create({
  baseURL: 'https://buggle.ga/api/',
  responseType: 'json'
})

export default function configureStore (initialState = {  }) {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(
        thunk,
        axiosMiddleware(client),
        createMySocketMiddleware('https://buggle.ga/socket.io')
      )
    )
  )
}