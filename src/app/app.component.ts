import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import { SignonService, E1Actions, StatusTypes } from 'e1-service';

import { SignonPromptComponent } from './e1/signon-prompt.component';
import { IState } from './store/state';
import { AppActions } from './store/actions';

declare var AIS_BASE_URL;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  status: Observable<string>;
  username: Observable<string>;
  environment: Observable<string>;
  signout() {
    this.store.dispatch(new AppActions.ResetAction());
    this.store.dispatch(new E1Actions.ResetAction('sign-out'));
  }
  ngOnInit() {
  }
  constructor(
    public store: Store<IState>,
    dlg: MatDialog,
    signon: SignonService
  ) {
    signon.baseUrl = AIS_BASE_URL;
    this.status = store.select<string>(s => s.e1.status);
    this.username = store.select<string>(s => s.e1.authResponse ? s.e1.authResponse.userInfo.alphaName : null);
    this.environment = store.select<string>(s => s.e1.authResponse ? s.e1.authResponse.environment : null);
    this.status
      .filter(status => status.localeCompare(StatusTypes.STATUS_OFF) === 0)
      .subscribe(() => {
        dlg.open(SignonPromptComponent, {
          disableClose: true,
          width: '250px'
        });
      });
  }
}
