import { first } from 'rxjs/operators';
import { Event, EventId } from './../home/home.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsId, UserDetails, School, SchoolId } from './../initialise/initialise.component';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '../../../node_modules/@angular/material';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'school-admin-students-events-dialog',
  templateUrl: './school-admin-students-events-dialog.component.html',
  styleUrls: ['./school-admin-students-events-dialog.component.css']
})
export class SchoolAdminStudentsEventsDialogComponent implements OnInit {

  constructor(
    private afs: AngularFirestore,
    public dialogRef: MatDialogRef<SchoolAdminStudentsEventsDialogComponent>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  userDetailsId: UserDetailsId;
  school: SchoolId;

  loaded: boolean = false;

  addEventId: string;

  events: { name: string, eventId: string }[];

  ngOnInit() {
    this.userDetailsId = this.data['userDetailsId'];
    this.school = this.data['school'];
    console.log(JSON.stringify(this.userDetailsId));
    this.getEvents();
  }

  async addEvent() {
    const eventRef: AngularFirestoreDocument<any> = this.afs.doc(`schools/${this.school.id}/events/${this.addEventId}`);
    this.afs.firestore.runTransaction(transaction => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(eventRef.ref).then(doc => {
        if (!doc.data().participants) {
          transaction.update(eventRef.ref, {
            participants: [this.userDetailsId.id]
          });
        } else {
          const participants = doc.data().participants;
          participants.push(this.userDetailsId.id);
          transaction.update(eventRef.ref, { participants: participants });
        }
      });
    }).then(() => {
      this.userDetailsId.events.push(this.addEventId);
      let update = this.userDetailsId;
      // Remove Id from the data we push to firestore!
      Object.keys(update).reduce((newObj, key) => {
        if (!update[key].id) {
          newObj[key] = update[key];
        }
        return newObj;
      }, {});
      this.afs.collection(`schools/${this.data.schoolId}/user-details`).doc(this.userDetailsId['id']).update(update)
        .then(() => {
          this.snackbar.open("Added event to user", null, { duration: 1000 });
          this.getEvents();
        }).catch(() => this.snackbar.open("Failed to add event to user. Contact support ASAP to resolve.", null, { duration: 1000 }));
    }).catch((err) => {
      console.log(err);
      this.snackbar.open("Failed to add user to event. Make sure that the id was correct.", null, { duration: 1000 })
    });
  }

  async removeEvent(event) {
    const eventRef: AngularFirestoreDocument<any> = this.afs.doc(`schools/${this.school.id}/events/${event.eventId}`);
    this.afs.firestore.runTransaction(transaction => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(eventRef.ref).then(doc => {
        if (!doc.data().participants) {
          transaction.update(eventRef.ref, {
            participants: []
          });
        } else {
          let participants: string[] = doc.data().participants;
          let index = participants.indexOf(this.userDetailsId.id);
          if (index != -1) {
            participants.splice(index, 1);
          }          
          console.log(participants);
          transaction.update(eventRef.ref, { participants: participants });
        }
      });
    }).then(() => {
      this.userDetailsId.events.splice(this.userDetailsId.events.indexOf(event.eventId), 1);
      let update = this.userDetailsId;
      // Remove Id from the data we push to firestore!
      Object.keys(update).reduce((newObj, key) => {
        if (!update[key].id) {
          newObj[key] = update[key];
        }
        return newObj;
      }, {});
      this.afs.collection(`schools/${this.data.schoolId}/user-details`).doc(this.userDetailsId['id']).update(update)
      .then(() => {
        this.snackbar.open("Removed event from user", null, { duration: 1000 });
        this.getEvents();
      }).catch(() => this.snackbar.open("Failed to remove event from user. Please contact support.", null, { duration: 1000 }));
  }).catch((err) => {
    console.log(err);
    this.snackbar.open("Failed to remove user from event. Please contact support.", null, { duration: 1000 })
  });
  }

  async getEvents() {
    this.loaded = false;
    this.events = []
    for (const eventId of this.userDetailsId.events) {
      let event = await this.afs.collection<Event>(`schools/${this.data['schoolId']}/events`).doc<Event>(eventId).valueChanges().pipe(first()).toPromise();
      this.events.push({ name: event.name, eventId: eventId });
    }
    this.loaded = true;
  }

}
