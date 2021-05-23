import { combineReducers } from 'redux'
import { connectRouter, RouterState } from 'connected-react-router'
import { History } from 'history'

import { LayoutState, layoutReducer } from './layout'
import { PoolState } from './pool/types'
import { poolReducer } from './pool/reducer'



// The top-level state object
export interface ApplicationState {
  layout: LayoutState
  router: RouterState
  pool: PoolState
}

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding ApplicationState property type.
export const createRootReducer = (history: History) =>
  combineReducers({
    layout: layoutReducer,
    pool: poolReducer,
    router: connectRouter(history)
  })
