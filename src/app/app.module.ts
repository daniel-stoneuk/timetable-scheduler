import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout"

import { AppComponent } from './app.component';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
  MatGridListModule, MatInputModule, MatFormFieldModule, MatCardModule, MatDividerModule,
  MatSnackBarModule, MatProgressSpinnerModule, MatRippleModule, MatBottomSheetModule
} from '@angular/material';
import { HomeComponent } from './home/home.component';

import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';

import { environment } from '../environments/environment';
import { FormsModule } from '../../node_modules/@angular/forms';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { LoginComponent } from './login/login.component';
import { InitialiseComponent } from './initialise/initialise.component';
import { NgForNumberLoopPipe } from './ng-for-number-loop.pipe';
import { EventSelectionBottomSheetComponent } from './event-selection-bottom-sheet/event-selection-bottom-sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    InitialiseComponent,
    NgForNumberLoopPipe,
    EventSelectionBottomSheetComponent,
  ],
  entryComponents: [
    EventSelectionBottomSheetComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FlexLayoutModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatBottomSheetModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
