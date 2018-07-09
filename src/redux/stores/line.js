//系统内置
import * as util from 'util';
import * as events from 'events';
import * as querystring from 'querystring';
//第三方
import * as assign from 'object-assign';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger'
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Framework7StateKernel, framework7Reducer, syncFramework7WithStore} from 'framework7-redux';

export const framework7StateKernel = new Framework7StateKernel();
export const store = createStore(
  combineReducers({
    framework7: framework7Reducer,
    lines: (state, action)=> {
      const { type, payload } = action;
      
      switch (type) {
        case "query":
          console.log(`name: ${payload}`)
          state = payload;
          break;
        case "switch":
          if (state.lineResults0) {
            state.lineResults0.direction = !state.lineResults0.direction;
          }
          if (state.lineResults1) {
            state.lineResults1.direction = !state.lineResults1.direction;
          }
          break;
        default:
          state = {}
          break;
      }
      return state;
    }
  }),
  applyMiddleware(thunk, logger)
);

syncFramework7WithStore(store, framework7StateKernel);