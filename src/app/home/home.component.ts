import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { UserDetails, School } from '../initialise/initialise.component';
import { User, AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators'
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentData } from 'angularfire2/firestore';
import { MatBottomSheet } from '@angular/material';
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

  constructor(private afs: AngularFirestore, private authService: AuthService, private bottomSheet: MatBottomSheet, private snackbar: MatSnackBar, private breakpointObserver: BreakpointObserver, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.HandsetLandscape,
    Breakpoints.HandsetPortrait]).subscribe((value) => {
      this.isHandset = value.matches;
      this.changeDetectorRef.detectChanges();
    });

    this.authService.getUser().subscribe(user => {
      this.user = user;
      this.afs.collection(`schools/${this.user.school}/user-details`).doc<UserDetails>(this.user.userDetails).valueChanges().subscribe(userDetails => {
        console.log("User details called")
        this.userDetails = userDetails;
      });
      this.afs.collection(`schools`).doc<School>(this.user.school).valueChanges().subscribe(school => {
        this.school = school;
      });
      this.afs.collection<Event>(`schools/${this.user.school}/events`).snapshotChanges().pipe(map(actions => actions.map(a => {
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
              if (event.participants.includes(this.user.userDetails)) {
                selectedSessionCount++;
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
    console.log(selectedSessionCount);
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
        data: { user: this.user, requiredSessionCount: this.userDetails.requiredSessionCount, selectedSessionCount: this.selectedSessionCount, events: events }
      });
    }
  }

  public toggleSelection(event) {
    const eventRef: AngularFirestoreDocument<any> = this.afs.doc(`schools/${this.user.school}/events/${event.event.id}`);
    let selected = event.event.participants.indexOf(this.user.userDetails);
    if (selected != -1) {
      event.event.participants.splice(selected, 1);
    } else if (event.event.participants.length < event.event.capacity) {
      if (this.userDetails.requiredSessionCount - this.selectedSessionCount > 0) {
        event.event.participants.push(this.user.userDetails);
      } else {
        this.snackbar.open("You have reached your max number of joined sessions.", null, { duration: 2000 });
      }
    } else if (this.userDetails.requiredSessionCount - this.selectedSessionCount > 0) {
      this.snackbar.open("This session is full. Try again later.", null, { duration: 2000 });
    }
    eventRef.update({
      participants: event.event.participants
    });
  }
}