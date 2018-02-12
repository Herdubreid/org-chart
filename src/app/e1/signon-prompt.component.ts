import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { Store } from '@ngrx/store';
import { SignonService } from 'e1-service';

/**
 * Signon Prompt
 */

@Component({
  selector: 'app-signon-prompt',
  template: `
  <h3 mat-dialog-title>Sign In</h3>
  <form (ngSubmit)="ok()">
    <fieldset [disabled]="busy">
      <mat-dialog-content>
        <mat-input-container class="full-width">
          <input matInput placeholder="JDE User ID" name="username" required [(ngModel)]="username">
        </mat-input-container>
      <mat-input-container class="full-width">
        <input matInput placeholder="Password" type="password" name="password" required [(ngModel)]="password">
      </mat-input-container>
      <mat-progress-bar *ngIf="busy" mode="indeterminate"></mat-progress-bar>
      <span class="full-width">{{ msg }}</span>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button class="full-width" [disabled]="busy" type="submit">Ok</button>
    </mat-dialog-actions>
    </fieldset>
    </form>`,
  styles: ['.full-width { width: 100%; }', 'fieldset { border: none; }']
})
export class SignonPromptComponent implements OnInit {
  username: string;
  password: string;
  msg: string;
  busy = false;
  ok() {
    this.msg = '';
    this.busy = true;
    this.signon.username = this.username;
    this.signon.password = this.password;
    this.signon.authenticate({
      success: () => {
        this.dlg.close();
      },
      error: msg => { this.msg = 'Sign In Error: Incorrect User Id or Password'; },
      done: () => { this.busy = false; }
    });
  }
  ngOnInit() {
  }
  constructor(
    public dlg: MatDialogRef<SignonPromptComponent>,
    public store: Store<any>,
    public signon: SignonService
  ) {
  }
}
