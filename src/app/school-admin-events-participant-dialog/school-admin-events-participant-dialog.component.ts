import { first } from 'rxjs/operators';
import { Event, EventId } from './../home/home.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsId, UserDetails, School, SchoolId } from './../initialise/initialise.component';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
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

  event: EventId;
  school: SchoolId;

  loaded: boolean = false;

  addParticipantId: string;

  participants: { displayName: string, userDetailId: string }[];

  ngOnInit() {
    this.event = this.data['eventId'];
    this.school = this.data['school'];

    this.getNames();
  }

  async addParticipant() {
    const userDetailsRef: AngularFirestoreDocument<any> = this.afs.doc(`schools/${this.school.id}/user-details/${this.addParticipantId}`);
    this.afs.firestore.runTransaction(transaction => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(userDetailsRef.ref).then(doc => {
        if (!doc.data().events) {
          transaction.set(userDetailsRef.ref, {
            events: [this.event.id]
          });
        } else {
          const events = doc.data().events;
          events.push(this.event.id);
          transaction.update(userDetailsRef.ref, { events: events });
        }
      });
    }).then(() => {
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
          this.snackbar.open("Added user to event", null, { duration: 1000 });
          this.getNames();
        }).catch(() => this.snackbar.open("Failed to add user to event. Contact support ASAP to resolve.", null, { duration: 1000 }));
    }).catch((err) => {
      console.log(err);
      this.snackbar.open("Failed to add event to user. Make sure that the id was correct.", null, { duration: 1000 })
    });
  }

  async removeParticipant(participant) {

    const userDetailsRef: AngularFirestoreDocument<any> = this.afs.doc(`schools/${this.school.id}/user-details/${participant.userDetailId}`);
    this.afs.firestore.runTransaction(transaction => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(userDetailsRef.ref).then(doc => {
        if (!doc.data().events) {
          transaction.set(userDetailsRef.ref, {
            events: []
          });
        } else {
          let events: string[] = doc.data().events;
          console.log(this.event.id);
          let index = events.indexOf(this.event.id);
          if (index != -1) {
            events.splice(index, 1);
          }
          transaction.update(userDetailsRef.ref, { events: events });
        }
      });
    }).then(() => {
      this.event.participants.splice(this.event.participants.indexOf(participant.userDetailId), 1);
      let update = this.event;
      console.log(this.event.id);
      // Remove Id from the data we push to firestore!
      Object.keys(update).reduce((newObj, key) => {
        if (!update[key].id) {
          newObj[key] = update[key];
        }
        return newObj;
      }, {});
      this.afs.collection(`schools/${this.data.schoolId}/events`).doc(this.event['id']).update(update)
        .then(() => {
          this.snackbar.open("Removed user from event", null, { duration: 1000 });
          this.getNames();
        }).catch(() => this.snackbar.open("Failed to remove user from event. Please contact support.", null, { duration: 1000 }));
    }).catch((err) => {
      console.log(err);
      this.snackbar.open("Failed to remove event from user. Please contact support.", null, { duration: 1000 })
    });
  }

  async getNames() {
    this.loaded = false;
    this.participants = []
    for (const userDetailId of this.event.participants) {
      let userDetail = await this.afs.collection<UserDetails>(`schools/${this.data['schoolId']}/user-details`).doc<UserDetails>(userDetailId).valueChanges().pipe(first()).toPromise();
      this.participants.push({ displayName: userDetail.displayName, userDetailId: userDetailId });
    }
    this.loaded = true;
  }

}
