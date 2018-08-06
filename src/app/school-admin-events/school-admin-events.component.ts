import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetails, School } from './../initialise/initialise.component';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { first } from 'rxjs/operators';
import { AuthService, User } from './../auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SchoolAdminEventsDataSource } from './school-admin-events-datasource';
import { SchoolAdminEventsEditDialogComponent } from '../school-admin-events-edit-dialog/school-admin-events-edit-dialog.component';
import { Observable } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-school-admin-events',
  templateUrl: './school-admin-events.component.html',
  styleUrls: ['./school-admin-events.component.css']
})
export class SchoolAdminEventsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: SchoolAdminEventsDataSource;

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  constructor(private breakpointObserver: BreakpointObserver, private afs: AngularFirestore, private authService: AuthService, private snackbar: MatSnackBar, private matDialog: MatDialog) { }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'capacity', 'participantCount', 'week', 'day', 'session', 'edit'];

  user: User;
  school: School;

  ngOnInit() {
    this.authService.getUser().subscribe((user) => { 
      this.user = user;
      this.afs.collection(this.user.school.parent).doc<School>(this.user.school.id).valueChanges().subscribe(school => {
        this.school = school;
      });
         });
    this.dataSource = new SchoolAdminEventsDataSource(this.afs, this.authService, this.paginator, this.sort);
  }

  async addEvent() {
    this.openEditDialog(undefined);
  }

  async delete(eventId) {
    console.log("Delete Event");
    this.afs.collection(`schools/${this.user.school.id}/events`).doc(eventId.id).delete()
        .then(() => this.snackbar.open("Deleted event", null, { duration: 1000 })).catch(() => this.snackbar.open("Failed to delete event", null, { duration: 1000 }));
  }

  async openEditDialog(eventId) {
    console.log("Open Edit Dialog");
    try {
      let schoolId = this.user.school.id;
      console.log("School Id: " + schoolId);
      let dialogRef = this.matDialog.open(SchoolAdminEventsEditDialogComponent, {
        data: { school: this.school, schoolId: schoolId, eventId: eventId },
        width: '50%',
        height: '60%',
        maxWidth: '100vw',
        maxHeight: '100vh'
      });
      const smallDialogSub = this.isExtraSmall.subscribe(result => {
        if (result.matches) {
          dialogRef.updateSize('100%', '100%');
        } else {
          dialogRef.updateSize('50%', '50%');
        }
      });
      dialogRef.afterClosed().subscribe(() => smallDialogSub.unsubscribe());
    } catch (err) {
      console.log(err);
    }
  }
}
