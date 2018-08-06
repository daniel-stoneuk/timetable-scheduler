import { Event } from './../home/home.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsId, UserDetails, School } from './../initialise/initialise.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '../../../node_modules/@angular/material';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'school-admin-events-edit-dialog',
  templateUrl: './school-admin-events-edit-dialog.component.html',
  styleUrls: ['./school-admin-events-edit-dialog.component.css']
})
export class SchoolAdminEventsEditDialogComponent implements OnInit {

  constructor(
    private afs: AngularFirestore,
    public dialogRef: MatDialogRef<SchoolAdminEventsEditDialogComponent>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  event: Event;
  school: School;

  backdropSubscription: Subscription;

  ngOnInit() {
    this.event = this.data['eventId'];
    this.school = this.data['school'];
    if (!!!this.event) {
      this.event = {
        capacity: 0,
        name: "New Event",
        timetablePosition: {
          day: 0,
          session: 0,
          week: 0
        },
        participants: []
      }
    }
    console.log(this.event);
    this.backdropSubscription = this.dialogRef.backdropClick().subscribe(() => {
      this.onSubmit();
    });
  }


  onSubmit() {
    if (!!this.data.eventId) {
      console.log("Updated details!");
      let update = this.event;
      // Remove Id from the data we push to firestore!
      Object.keys(update).reduce((newObj, key) => {
        if (!update[key].id) {
          newObj[key] = update[key];
        }
        return newObj;
      }, {});
      console.log(update);
      this.afs.collection(`schools/${this.data.schoolId}/events`).doc(this.event['id']).update(update)
        .then(() => this.snackbar.open("Updated successfully", null, { duration: 1000 })).catch(() => this.snackbar.open("Failed to update", null, { duration: 1000 }));

    } else {
      // Create new user
      this.afs.collection<Event>(`schools/${this.data.schoolId}/events`).add(this.event)
        .then(() => this.snackbar.open("Added new event", null, { duration: 1000 })).catch(() => this.snackbar.open("Failed to add event", null, { duration: 1000 }));

    }
    this.backdropSubscription.unsubscribe();
    this.dialogRef.close();
  }
}
