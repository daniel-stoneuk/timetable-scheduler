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
  requiredSessionCount: number;
  selectedSessionCount: number;

  eventUpdateSub: Subscription;

  ngOnInit() {
    this.user = this.data['user'];
    this.requiredSessionCount = this.data['requiredSessionCount'];
    this.selectedSessionCount = this.data['selectedSessionCount'];
    this.evs = this.data['events'];

    console.log(this.data);

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
    for (let ev of this.evs) {
      const eventRef: AngularFirestoreDocument<any> = this.afs.doc(`schools/${this.user.school}/events/${ev.event.id}`);
      let selected = ev.event.participants.indexOf(this.user.userDetails);
      if (selected != -1) {
        this.selectedSessionCount = this.selectedSessionCount - 1;
      } 
    }
    for (let ev of this.evs) {
      const eventRef: AngularFirestoreDocument<any> = this.afs.doc(`schools/${this.user.school}/events/${ev.event.id}`);
      let selected = ev.event.participants.indexOf(this.user.userDetails);
      if (event.event.id === ev.event.id) {
        if (selected != -1) {
          ev.event.participants.splice(selected, 1);
          eventRef.update({
            participants: ev.event.participants
          });
        } else if (event.event.participants.length < event.event.capacity) {
          if (this.requiredSessionCount - this.selectedSessionCount > 0) {
            ev.event.participants.push(this.user.userDetails);
            eventRef.update({
              participants: ev.event.participants
            });
            this.selectedSessionCount = this.selectedSessionCount + 1;
          } else {
            this.snackbar.open("You have reached your max number of joined sessions.", null, { duration: 2000 });
          }
        } else if (this.requiredSessionCount - this.selectedSessionCount > 0) {
          this.snackbar.open("This session is full. Try again later.", null, { duration: 2000 });
        }
      } else if (selected != -1) {
        ev.event.participants.splice(selected, 1);
        eventRef.update({
          participants: ev.event.participants
        });
      }
    }
  }
}
