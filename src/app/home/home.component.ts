import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { UserDetails, School } from './../initialise/initialise.component';
import { User, AuthService } from './../auth.service';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators'
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentData, DocumentReference } from '../../../node_modules/angularfire2/firestore';
import { MatBottomSheet } from '../../../node_modules/@angular/material';
import { EventSelectionBottomSheetComponent } from '../event-selection-bottom-sheet/event-selection-bottom-sheet.component';

export interface Event {
  capacity: number;
  name: string;
  timetablePosition: {
    day: number;
    session: number;
    week: number;
  }
  participants: string[]
}

export interface EventId extends Event {
  id: string;
}

export interface Session {
  num?: number;
  break: boolean;
  events: [{
    event: Event;
    selected: boolean;
  }];
}

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;
  userDetails: UserDetails;
  selectedSessionCount: number;
  school: School;
  isHandset: boolean = false;

  // week / day / session
  sessions: Session[][][];

  events: EventId[];

  constructor(private afs: AngularFirestore, private authService: AuthService, private bottomSheet: MatBottomSheet, private breakpointObserver: BreakpointObserver,  private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.HandsetLandscape,
      Breakpoints.HandsetPortrait]).subscribe((value) => {
        this.isHandset = value.matches;
        this.changeDetectorRef.detectChanges();
      });
    
    this.authService.getUser().subscribe(user => {
      this.user = user;
      this.afs.collection(this.user.userDetails.parent).doc<UserDetails>(this.user.userDetails.id).valueChanges().subscribe(userDetails => {
        console.log("User details called")
        this.userDetails = userDetails;
      });
      this.afs.collection(this.user.school.parent).doc<School>(this.user.school.id).valueChanges().subscribe(school => {
        this.school = school;
      });
      this.afs.collection<EventId>(`schools/${this.user.school.id}/events`).snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data() as EventId;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))).subscribe(events => {
        this.events = events;
        this.calculateSessions()
      });
    });
  }

  calculateSessions() {
    let sessions = [];
    let weekCount = this.school.timetable.weekData.names.length;
    let dayCount = this.school.timetable.dayData.names.length;
    let sessionCount = this.school.timetable.sessionData.count;
    let selectedSessionCount = 0;
    for (var week = 0; week < weekCount; week++) {
      sessions[week] = [];
      for (var day = 0; day < dayCount; day++) {
        sessions[week][day] = [];
        for (var session = 0; session < sessionCount; session++) {
          let filtered = (this.events.filter((event) => {
            return (event.timetablePosition.day === day && event.timetablePosition.session === session && event.timetablePosition.week === week);
          }));
          let events = [];
          if (filtered.length > 0) {
            for (let event of filtered) {
              let selected = false;
              if (event.participants.includes(this.user.userDetails.id)) {
                selectedSessionCount ++;
                selected = true;
              }
              events.push({ event: event, selected: selected });
            }
          }
          sessions[week][day].push({ num: session, break: false, events: events });
        }
        this.school.timetable.sessionData.breakAfter.sort((n1, n2) => { return n1 - n2 });
        let added = 0;
        for (var brk of this.school.timetable.sessionData.breakAfter) {
          sessions[week][day].splice(+brk + added + 1, 0, { break: true });
          added++;
        }
      }
    }
    console.log(sessions);
    this.selectedSessionCount = selectedSessionCount;
    this.sessions = sessions;
  }

  isSelected(session: Session) {
    for (let ev of session.events) {
      if (ev.selected) return true;
    }
  }

  async onSelect(events) {
    if (events.length === 1) {
      this.toggleSelection(events[0]);
    } else {
      const bottomSheetRef = this.bottomSheet.open(EventSelectionBottomSheetComponent, {
       data: {user: this.user, events: events}
      });
    }
  }

  toggleSelection(event) {
    const eventRef: AngularFirestoreDocument<any> = this.afs.doc(`schools/${this.user.school.id}/events/${event.event.id}`);
    let selected = event.event.participants.indexOf(this.user.userDetails.id);
    if (selected != -1) {
      event.event.participants.splice(selected, 1);
    } else {
      event.event.participants.push(this.user.userDetails.id);
    }
    eventRef.update({
      participants: event.event.participants
    });
  }
}