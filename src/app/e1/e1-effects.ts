import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { E1ActionTypes, E1Actions, IAuthResponse, FormService, DatabrowserService } from 'e1-service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/empty';

import { E1HelperService } from './e1-helper';
import { WWEmployeesRequest, IWWEmployeesResponse, W060116F } from './ww-employees';
import { F0010Request, IF0010Response, F0010 } from './f0010';
import { F0006Request, IF0006Response, F0006 } from './f0006';
import { IEmployee } from '../store/state';
import { AppActions, ActionTypes } from '../store/actions';
/**
 * E1 Effects Service
 */
@Injectable()
export class E1EffectsService {
    @Effect()
    authResponse$ = this.actions$.ofType<E1Actions.AuthResponseAction>(E1ActionTypes.AUTH_RESPONSE)
        .map(action => action.payload.authResponse)
        .switchMap((authResponse: IAuthResponse) => {
            return Observable.of(new AppActions.RefreshAction);
        });
    @Effect({ dispatch: false })
    refresh$ = this.actions$.ofType<AppActions.RefreshAction>(ActionTypes.REFRESH)
        .do(() => {
            this.form.request = new WWEmployeesRequest();
            this.e1.call(this.form);
            this.db.request = new F0010Request();
            this.e1.call(this.db);
        });
    @Effect()
    employeeResponse$ = this.actions$.ofType<E1Actions.FormResponseAction>(E1ActionTypes.FORM_RESPONSE)
        .map(action => action.payload.formResponse)
        .filter(formResponse => formResponse[W060116F])
        .switchMap((form: IWWEmployeesResponse) => {
            const mcus = form.fs_P060116_W060116F.data.gridData.rowset
                .map(r => r.sHomeBusinessUnit_36.value.trim())
                .filter((r, pos, ar) => ar.indexOf(r) === pos);
            const request = new F0006Request();
            request.MCUq = mcus;
            this.db.request = request;
            this.e1.call(this.db);
            return Observable.of(new AppActions.EmployeesAction(
                form.fs_P060116_W060116F.data.gridData.rowset.map<IEmployee>(r => {
                    return {
                        an8: r.mnAddressNumber_29.value,
                        alph: r.sAlphaName_30.value,
                        anpa: r.mnSupervisor_57.value,
                        hco: r.sCo_35.value,
                        hmcu: r.sHomeBusinessUnit_36.value.trim(),
                        shft: r.sShiftcode_89.value
                    };
                })
            ));
        });
    @Effect()
    buResponse$ = this.actions$.ofType<E1Actions.DatabrowserResponseAction>(E1ActionTypes.DATABROWSER_RESPONSE)
        .map(action => action.payload.databrowserResponse)
        .filter(dbResponse => dbResponse[F0006])
        .switchMap((f0006: IF0006Response) => {
            return Observable.of(new AppActions.MCUsActions(f0006.fs_DATABROWSE_F0006.data.gridData.rowset
                .map(r => {
                    return {
                        mcu: r.F0006_MCU.value.trim(),
                        title: r.F0006_DL01.value,
                        co: r.F0006_CO.value
                    };
                })));
        });
    @Effect()
    coResponse$ = this.actions$.ofType<E1Actions.DatabrowserResponseAction>(E1ActionTypes.DATABROWSER_RESPONSE)
        .map(action => action.payload.databrowserResponse)
        .filter(dbResponse => dbResponse[F0010])
        .switchMap((f0010: IF0010Response) => {
            return Observable.of(new AppActions.COsActions(f0010.fs_DATABROWSE_F0010.data.gridData.rowset
                .map(r => {
                    return {
                        co: r.F0010_CO.value,
                        title: r.F0010_NAME.value
                    };
                })));
        });
    constructor(
        public actions$: Actions,
        public form: FormService,
        public db: DatabrowserService,
        public e1: E1HelperService
    ) { }
}
