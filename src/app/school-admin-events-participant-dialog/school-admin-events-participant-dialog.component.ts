import { first } from 'rxjs/operators';
import { Event } from './../home/home.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsId, UserDetails, School } from './../initialise/initialise.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '../../../node_modules/@angular/material';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'school-admin-events-participant-dialog',
  templateUrl: './school-admin-events-participant-dialog.component.html',
  styleUrls: ['./school-admin-events-participant-dialog.component.css']
})
export class SchoolAdminEventsParticipantDialogComponent implements OnInit {

  constructor(
    private afs: AngularFirestore,
    public dialogRef: MatDialogRef<SchoolAdminEventsParticipantDialogComponent>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  event: Event;
  school: School;

  loaded: boolean = false;

  addParticipantId: string;

  participants: { displayName: string, userDetailId: string }[];

  ngOnInit() {
    this.event = this.data['eventId'];
    this.school = this.data['school'];

    this.getNames();
  }

  async addParticipant() {
    this.event.participants.push(this.addParticipantId);
    let update = this.event;
    // Remove Id from the data we push to firestore!
    Object.keys(update).reduce((newObj, key) => {
      if (!update[key].id) {
        newObj[key] = update[key];
      }
      return newObj;
    }, {});
    this.afs.collection(`schools/${this.data.schoolId}/events`).doc(this.event['id']).update(update)
      .then(() => {
        this.snackbar.open("Updated successfully", null, { duration: 1000 });
        this.getNames();
      }).catch(() => this.snackbar.open("Failed to update", null, { duration: 1000 }));
  
  }

  async removeParticipant(participant) {
    this.event.participants.splice(this.event.participants.indexOf(participant.userDetailId), 1);
    let update = this.event;
    // Remove Id from the data we push to firestore!
    Object.keys(update).reduce((newObj, key) => {
      if (!update[key].id) {
        newObj[key] = update[key];
      }
      return newObj;
    }, {});
    this.afs.collection(`schools/${this.data.schoolId}/events`).doc(this.event['id']).update(update)
      .then(() => {
        this.snackbar.open("Updated successfully", null, { duration: 1000 });
        this.getNames();
      }).catch(() => this.snackbar.open("Failed to update", null, { duration: 1000 }));
  }

  async getNames() {
    this.participants = []
    for (const userDetailId of this.event.participants) {
      let userDetail = await this.afs.collection<UserDetails>(`schools/${this.data['schoolId']}/user-details`).doc<UserDetails>(userDetailId).valueChanges().pipe(first()).toPromise();
      this.participants.push({ displayName: userDetail.displayName, userDetailId: userDetailId });
    }
    this.loaded = true;
  }

}
