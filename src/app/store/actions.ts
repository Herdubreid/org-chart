import { Action } from '@ngrx/store';

import { IAppState, IEmployee, IMCU, ICO } from './state';
/**
 * Application Actions
 */
export enum ActionTypes {
    COS = 'COS',
    EMPLOYEES = 'EMPLOYEES',
    MCUS = 'BUS',
    REFRESH = 'REFRESH',
    RESET = 'RESET'
}
export namespace AppActions {
    export class COsActions implements Action {
        readonly type = ActionTypes.COS;
        constructor(public cos: ICO[]) { }
    }
    export class EmployeesAction implements Action {
        readonly type = ActionTypes.EMPLOYEES;
        constructor(public employees: IEmployee[]) { }
    }
    export class MCUsActions implements Action {
        readonly type = ActionTypes.MCUS;
        constructor(public mcus: IMCU[]) { }
    }
    export class RefreshAction implements Action {
        readonly type = ActionTypes.REFRESH;
    }
    export class ResetAction implements Action {
        readonly type = ActionTypes.RESET;
    }
    export type AllActions =
        COsActions |
        EmployeesAction |
        MCUsActions |
        RefreshAction |
        ResetAction;
}
