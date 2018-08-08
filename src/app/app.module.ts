import { SchoolAdminEventsEditDialogComponent } from './school-admin-events-edit-dialog/school-admin-events-edit-dialog.component';
import { SchoolAdminRoutingModule } from './school-admin-routing/school-admin-routing.module';
import { AuthGuard } from './auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from "@angular/flex-layout"

import { AppComponent } from './app.component';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
  MatGridListModule, MatInputModule, MatFormFieldModule, MatCardModule, MatDividerModule,
  MatSnackBarModule, MatProgressSpinnerModule, MatRippleModule, MatBottomSheetModule,
   MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatSelectModule, MatProgressBarModule
} from '@angular/material';
import { HomeComponent } from './home/home.component';

import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';

import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { LoginComponent } from './login/login.component';
import { InitialiseComponent } from './initialise/initialise.component';
import { NgForNumberLoopPipe } from './ng-for-number-loop.pipe';
import { EventSelectionBottomSheetComponent } from './event-selection-bottom-sheet/event-selection-bottom-sheet.component';
import { SchoolAdminComponent } from './school-admin/school-admin.component';
import { SchoolAdminStudentsComponent } from './school-admin-students/school-admin-students.component';
import { SchoolAdminStudentsEditDialogComponent } from './school-admin-students-edit-dialog/school-admin-students-edit-dialog.component';
import { SchoolAdminHomeComponent } from './school-admin-home/school-admin-home.component';
import { SchoolAdminEventsComponent } from './school-admin-events/school-admin-events.component';
import { SchoolAdminEventsParticipantDialogComponent } from './school-admin-events-participant-dialog/school-admin-events-participant-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    InitialiseComponent,
    NgForNumberLoopPipe,
    EventSelectionBottomSheetComponent,
    SchoolAdminComponent,
    SchoolAdminStudentsComponent,
    SchoolAdminStudentsEditDialogComponent,
    SchoolAdminEventsComponent,
    SchoolAdminEventsEditDialogComponent,
    SchoolAdminHomeComponent,
    SchoolAdminEventsParticipantDialogComponent,
  ],
  entryComponents: [
    EventSelectionBottomSheetComponent,
    SchoolAdminStudentsEditDialogComponent,
    SchoolAdminEventsEditDialogComponent,
    SchoolAdminEventsParticipantDialogComponent
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
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule,
    MatProgressBarModule,
    AppRoutingModule,
    SchoolAdminRoutingModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
