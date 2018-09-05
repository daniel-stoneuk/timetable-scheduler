import { EventId } from './../home/home.component';
import { SchoolAdminEventsParticipantDialogComponent } from './../school-admin-events-participant-dialog/school-admin-events-participant-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetails, School, SchoolId } from './../initialise/initialise.component';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { first, map } from 'rxjs/operators';
import { AuthService, User } from './../auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SchoolAdminEventsDataSource } from './school-admin-events-datasource';
import { SchoolAdminEventsEditDialogComponent } from '../school-admin-events-edit-dialog/school-admin-events-edit-dialog.component';
import { Observable } from '../../../node_modules/rxjs';
import { saveAs } from 'file-saver/FileSaver';
import { take } from '../../../node_modules/rxjs/operators'

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
  displayedColumns = ['id', 'name', 'subtitle', 'capacity', 'participantCount', 'week', 'day', 'session', 'edit'];

  user: User;
  school: SchoolId;

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      this.user = user;
      this.afs.collection('/schools').doc<SchoolId>(this.user.school).valueChanges().subscribe(school => {
        this.school = { id: this.user.school, ...school };
      });
    });
    this.dataSource = new SchoolAdminEventsDataSource(this.afs, this.authService, this.paginator, this.sort);
  }

  async addEvent() {
    this.openEditDialog(undefined);
  }

  async delete(eventId: EventId) {
    if (eventId.participants.length == 0) {
      console.log("Delete Event");
      this.afs.collection(`schools/${this.user.school}/events`).doc(eventId.id).delete()
        .then(() => this.snackbar.open("Deleted event", null, { duration: 1000 })).catch(() => this.snackbar.open("Failed to delete event", null, { duration: 1000 }));
    } else {
      this.snackbar.open("Cannot delete event with participants", null, { duration: 1000 })
    }
  }

  async copyId(eventId: EventId) {
    this.copyMessage(eventId.id);
    this.snackbar.open("Copied event id: " + eventId.id, null, { duration: 1000 });
  }
   
  async exportToFile() {
    let csv = "Event Name,Subtitle,Capacity,Participant Count,Participant Names\r\n"
    let events: Event[] = await this.afs.collection<Event>(`/schools/${this.user.school}/events`).valueChanges().pipe(take(1)).toPromise();
    for (let event of events) {
      csv += event.name + "," + event.subtitle + "," + event.capacity + "," + event.participants.length + ",\r\n";
      for (const userDetailId of event.participants) {
        let userDetail = await this.afs.collection<UserDetails>(`schools/${this.user.school}/user-details`).doc<UserDetails>(userDetailId).valueChanges().pipe(first()).toPromise();
        csv += ",,,,"+ userDetail.displayName +  "\r\n";
      }
      
      csv += "\r\n";
    }
    console.log(JSON.stringify(events));
    this.saveToFileSystem(csv);
  }

  saveToFileSystem(data) {
    const blob = new Blob([data], { type: 'text/plain' });
    saveAs(blob, "choosewhenexport.csv");
  }

  copyMessage(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  
  async openParticipantDialog(eventId) {
    console.log("Open Participant Dialog");
    let schoolId = this.user.school;
    let dialogRef = this.matDialog.open(SchoolAdminEventsParticipantDialogComponent, {
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

  }

  async openEditDialog(eventId) {
    console.log("Open Edit Dialog");
    let schoolId = this.user.school;
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

  }
}
