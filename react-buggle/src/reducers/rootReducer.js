/*
 src/reducers/rootReducer.js
*/
import { combineReducers } from 'redux'
import boardReducer from './boardReducer'
import checkReducer from './checkReducer';

export default combineReducers({
  check: checkReducer,
  board: boardReducer
})