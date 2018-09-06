import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetails } from './../initialise/initialise.component';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { EventId } from '../home/home.component';
import { User } from '../auth.service';
import { map } from 'rxjs/operators';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'event-selection-bottom-sheet',
  templateUrl: './event-selection-bottom-sheet.component.html',
  styleUrls: ['./event-selection-bottom-sheet.component.css']
})
export class EventSelectionBottomSheetComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private bottomSheetRef: MatBottomSheetRef<EventSelectionBottomSheetComponent>, private afs: AngularFirestore, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private changeDetectorRef: ChangeDetectorRef) { }

  // Some of this needs cleaning up

  evs; // wrapped events

  user: User;
  userDetails: UserDetails;
  selectedEventCount: number;

  eventUpdateSub: Subscription;

  ngOnInit() {
    this.user = this.data['user'];
    this.userDetails = this.data['userDetails'];
    this.selectedEventCount = this.data['selectedEventCount'];
    this.evs = this.data['events'];

    this.eventUpdateSub = this.afs.collection<EventId>(`schools/${this.user.school}/events`).snapshotChanges().pipe(map(actions => actions.map(a => {
      const data = a.payload.doc.data() as EventId;
      const id = a.payload.doc.id;
      return { id, ...data };
    }))).subscribe(result => {
      let temp = [];
      for (let ev of this.evs) {
        let matchedElement = result.find((element) => {
          return ev.event.id === element.id
        });
        let selected = false;
        if (matchedElement.participants.includes(this.user.userDetails)) {
          selected = true;
        }
        temp.push({ event: matchedElement, selected: selected });
      }
      this.evs = temp;
      this.changeDetectorRef.detectChanges();
    });

    this.bottomSheetRef.afterDismissed().subscribe(() => {
      this.eventUpdateSub.unsubscribe();
    })
  }

  onSelection(event) {
    const userDetailsRef: AngularFirestoreDocument<any> = this.afs.doc(`schools/${this.user.school}/user-details/${this.user.userDetails}`);
    for (let ev of this.evs) {
      const eventRef: AngularFirestoreDocument<any> = this.afs.doc(`schools/${this.user.school}/events/${ev.event.id}`);
      let eventParticipantIndex = ev.event.participants.indexOf(this.user.userDetails);
      if (eventParticipantIndex != -1) {
        this.selectedEventCount = this.selectedEventCount - 1;
      }
    }
    for (let ev of this.evs) {
      const eventRef: AngularFirestoreDocument<any> = this.afs.doc(`schools/${this.user.school}/events/${ev.event.id}`);
      let eventParticipantIndex = ev.event.participants.indexOf(this.user.userDetails);
      if (event.event.id === ev.event.id) {
        if (eventParticipantIndex != -1) {
          event.event.participants.splice(eventParticipantIndex, 1);
          eventRef.update({
            participants: ev.event.participants
          });
        } else if (event.event.participants.length < event.event.capacity) {
          if (this.userDetails.requiredEventCount - this.selectedEventCount > 0) {
            event.event.participants.push(this.user.userDetails);
            eventRef.update({
              participants: ev.event.participants
            });
            this.selectedEventCount = this.selectedEventCount + 1;
          } else {
            this.snackbar.open("You have reached your max number of joined events.", null, { duration: 2000 });
          }
        } else if (this.userDetails.requiredEventCount - this.selectedEventCount > 0) {
          this.snackbar.open("This event is full. Try again later.", null, { duration: 2000 });
        }
      } else if (eventParticipantIndex != -1) {
        ev.event.participants.splice(eventParticipantIndex, 1);
        eventRef.update({
          participants: ev.event.participants
        });
      }
    }
  }
}
