import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { SignonService, IServiceCallback } from 'e1-service';

import { SignonPromptComponent } from './signon-prompt.component';
/**
 * E1 Helper
 */
export interface IServiceCall {
    call(callback: IServiceCallback);
}

@Injectable()
export class E1HelperService {
    retry = 0;
    promptSignon(service: IServiceCall, callback: IServiceCallback = {}) {
        this.dlg.open(SignonPromptComponent, {
            disableClose: true,
            width: '250px'
        }).afterClosed().subscribe(() => {
            service.call(callback);
        });
    }
    autoSignon(service: IServiceCall, callback: IServiceCallback = {}) {
        if (this.signon.inCall) {
            return;
        }
        this.signon.authenticate({
            success: () => { this.retry = 0; },
            error: () => { this.promptSignon(service, callback); }
        });
    }
    call(service: IServiceCall, callback: IServiceCallback = {}, cancel = {}) {
        const cb = Object.assign({}, callback, {
            error: msg => { this.autoSignon(service, callback); }
        });
        if (this.signon.hasToken && this.retry < 3) {
            service.call(cb);
        } else {
            this.promptSignon(service, callback);
        }
    }
    constructor(
        public dlg: MatDialog,
        public store: Store<any>,
        public signon: SignonService,
    ) {
    }
}
