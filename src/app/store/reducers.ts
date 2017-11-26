import { e1Reducer } from 'e1-service';

import { IAppState, initialAppState } from './state';
import { AppActions, ActionTypes } from './actions';
/**
 * Application Reducers
 */
export function appReducer(state = initialAppState, action: AppActions.AllActions): IAppState {
    switch (action.type) {
        case ActionTypes.COS:
            return Object.assign({}, state, {
                cos: [...action.cos]
            });
        case ActionTypes.EMPLOYEES:
            return Object.assign({}, state, {
                employees: [...action.employees]
            });
        case ActionTypes.MCUS:
            return Object.assign({}, state, {
                mcus: [...action.mcus]
            });
        case ActionTypes.RESET:
            return initialAppState;
        default:
            return state;
    }
}
export const reducer = { app: appReducer, e1: e1Reducer };
