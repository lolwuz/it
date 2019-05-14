/*
 src/reducers/rootReducer.js
*/
import { combineReducers } from 'redux'
import boardReducer from './boardReducer'
import checkReducer from './checkReducer'
import ioReducer from './ioReducer'
import scoreReducer from './scoreReducer';

export default combineReducers({
  check: checkReducer,
  board: boardReducer,
  io: ioReducer,
  scores: scoreReducer
})