import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { EventId } from '../home/home.component';
import { User } from '../auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'event-selection-bottom-sheet',
  templateUrl: './event-selection-bottom-sheet.component.html',
  styleUrls: ['./event-selection-bottom-sheet.component.css']
})
export class EventSelectionBottomSheetComponent implements OnInit {

  constructor(private afs: AngularFirestore, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private changeDetectorRef: ChangeDetectorRef) { }

  // Some of this needs cleaning up

  evs; // wrapped events

  user: User;

  ngOnInit() {
    this.user = this.data['user'];
    this.evs = this.data['events'];

    this.afs.collection<EventId>(`schools/${this.user.school.id}/events`).snapshotChanges().pipe(map(actions => actions.map(a => {
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
        if (matchedElement.participants.includes(this.user.userDetails.id)) {
          selected = true;
        }
        temp.push({ event: matchedElement, selected: selected });
      }
      this.evs = temp;
      this.changeDetectorRef.detectChanges();
    });
  }

  onSelection(event) {
    for (let ev of this.evs) {
      const eventRef: AngularFirestoreDocument<any> = this.afs.doc(`schools/${this.user.school.id}/events/${ev.event.id}`);
      let selected = ev.event.participants.indexOf(this.user.userDetails.id);
      ev.event.participants.splice(selected, 1);
      if (event.event.id === ev.event.id) {
        if (selected == -1) {
          ev.event.participants.push(this.user.userDetails.id);
        }
      }
      eventRef.update({
        participants: ev.event.participants
      });
    }
  }
}
