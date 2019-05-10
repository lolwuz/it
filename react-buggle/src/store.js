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

const client = axios.create({
  baseURL: 'http://141.252.234.193:5000/api/',
  responseType: 'json'
})

export default function configureStore (initialState = {  }) {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(
        thunk,
        axiosMiddleware(client)
      )
    )
  )
}