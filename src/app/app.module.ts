import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, NgModel } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { E1ServiceModule } from 'e1-service';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { MaterialModule } from './material.module';
import { reducer } from './store/reducers';
import { E1EffectsService } from './e1/e1-effects';
import { E1HelperService } from './e1/e1-helper';
import { SignonPromptComponent } from './e1/signon-prompt.component';
import { ChartComponent } from './chart/chart.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    SignonPromptComponent,
    ChartComponent,
    ListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    E1ServiceModule,
    StoreModule.forRoot(reducer),
    EffectsModule.forRoot([E1EffectsService]),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  entryComponents: [
    SignonPromptComponent
  ],
  providers: [
    NgModel,
    E1HelperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
