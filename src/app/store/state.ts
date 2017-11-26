import { IServerState, initialServerState } from 'e1-service';
/**
 * Application State
 */
export interface ICO {
    co: string;
    title: string;
}
export interface IMCU {
    mcu: string;
    co: string;
    title: string;
}
export interface IEmployee {
    an8: string;
    alph: string;
    anpa: string;
    hco: string;
    hmcu: string;
    shft: string;
}
export interface IAppState {
    cos: ICO[];
    employees: IEmployee[];
    mcus: IMCU[];
}
export interface IState {
    app: IAppState;
    e1: IServerState;
}
export const initialAppState = {
    cos: [],
    employees: [],
    mcus: []
};
export const initialState = {
    app: initialAppState,
    e1: initialServerState
};
