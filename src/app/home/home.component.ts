import { MatSnackBar } from "@angular/material/snack-bar";
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints
} from "@angular/cdk/layout";
import { UserDetails, School } from "../initialise/initialise.component";
import { User, AuthService } from "../auth.service";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentData
} from "angularfire2/firestore";
import { MatBottomSheet } from "@angular/material";
import { EventSelectionBottomSheetComponent } from "../event-selection-bottom-sheet/event-selection-bottom-sheet.component";
import { timeout } from "q";

export interface Event {
  capacity: number;
  name: string;
  subtitle: string;
  timetablePosition: {
    day: number;
    session: number;
    week: number;
  };
  participants: string[];
}

export interface EventId extends Event {
  id: string;
}

export interface Session {
  num?: number;
  break: boolean;
  events: [
    {
      event: Event;
      selected: boolean;
    }
  ];
}

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  user: User;
  userDetails: UserDetails;
  selectedEventCount: number;
  school: School;
  isHandset: boolean = false;

  canSelectSession: boolean = true;

  loadingSnackbar: MatSnackBar;

  // week / day / session
  sessions: Session[][][];

  events: EventId[];

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private bottomSheet: MatBottomSheet,
    private snackbar: MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe(value => {
        this.isHandset = value.matches;
        this.changeDetectorRef.detectChanges();
      });
    this.authService.getUser().subscribe(user => {
      console.log("Received an updated school object");
      this.user = user;
      this.afs
        .collection(`schools/${this.user.school}/user-details`)
        .doc<UserDetails>(this.user.userDetails)
        .valueChanges()
        .pipe(take(1))
        .subscribe(
          userDetails => {
            console.log("Received an updated userDetails object");
            this.userDetails = userDetails;
            this.afs
              .collection(`schools`)
              .doc<School>(this.user.school)
              .valueChanges()
              .pipe(take(1))
              .subscribe(
                school => {
                  console.log("Received an updated school object");
                  this.school = school;
                  this.afs
                    .collection<Event>(`schools/${this.user.school}/events`)
                    .snapshotChanges()
                    .pipe(
                      map(actions =>
                        actions.map(a => {
                          const data = a.payload.doc.data() as EventId;
                          const id = a.payload.doc.id;
                          return { id, ...data };
                        })
                      )
                    )
                    .subscribe(
                      events => {
                        console.log("Received an updated events object");
                        this.events = events;
                        console.log(JSON.stringify(events));
                        this.calculateSessions();
                      },
                      err => console.log(err)
                    );
                },
                err => console.log(err)
              );
              window['drift'].identify(this.user.uid, {
                email: this.user.email,
                nickname: this.userDetails.displayName
              })
          },
          err => console.log(err)
        );
    });
  }

  calculateSessions() {
    let sessions = [];
    let weekCount = this.school.timetable.weekData.names.length;
    let dayCount = this.school.timetable.dayData.names.length;
    let sessionCount = this.school.timetable.sessionData.count;
    let selectedEventCount = 0;
    for (var week = 0; week < weekCount; week++) {
      sessions[week] = [];
      for (var day = 0; day < dayCount; day++) {
        sessions[week][day] = [];
        for (var session = 0; session < sessionCount; session++) {
          let filtered = this.events.filter(event => {
            return (
              event.timetablePosition.day === day &&
              event.timetablePosition.session === session &&
              event.timetablePosition.week === week
            );
          });
          let events = [];
          if (filtered.length == 1) {
            for (let event of filtered) {
              let selected = false;
              if (event.participants.includes(this.user.userDetails)) {
                selectedEventCount++;
                selected = true;
              }
              events.push({ event: event, selected: selected });
            }
          }
          sessions[week][day].push({
            num: session,
            break: false,
            events: events
          });
        }
        this.school.timetable.sessionData.breakAfter.sort((n1, n2) => {
          return n1 - n2;
        });
        let added = 0;
        for (var brk of this.school.timetable.sessionData.breakAfter) {
          sessions[week][day].splice(+brk + added + 1, 0, { break: true });
          added++;
        }
      }
    }
    console.log("Selected " + selectedEventCount + " events");
    this.selectedEventCount = selectedEventCount;
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
      const bottomSheetRef = this.bottomSheet.open(
        EventSelectionBottomSheetComponent,
        {
          data: {
            user: this.user,
            userDetails: this.userDetails,
            selectedEventCount: this.selectedEventCount,
            events: events
          }
        }
      );
    }
  }

  public toggleSelection(event) {
    if (this.canSelectSession) {
      this.canSelectSession = false;
      const eventRef: AngularFirestoreDocument<any> = this.afs.doc(
        `schools/${this.user.school}/events/${event.event.id}`
      );
      let eventParticipantIndex = event.event.participants.indexOf(
        this.user.userDetails
      );
      if (eventParticipantIndex != -1) {
        event.event.participants.splice(eventParticipantIndex, 1);
        this.snackbar.open("Leaving - if this takes a while please check your internet connection");
          eventRef
            .update({
              participants: event.event.participants
            })
            .then(() => {
              this.canSelectSession = true;
              this.snackbar.open("You have left the event", null, {duration: 500});
            })
            .catch(err => {
              console.log(err);
              this.canSelectSession = true;
              this.snackbar.open("An error occurred, please try again");
            });
      } else if (event.event.participants.length < event.event.capacity) {
        if (this.userDetails.requiredEventCount - this.selectedEventCount > 0) {
          this.selectedEventCount = this.selectedEventCount + 1;
          event.event.participants.push(this.user.userDetails);
          this.snackbar.open("Joining - if this takes a while please check your internet connection");
          eventRef
            .update({
              participants: event.event.participants
            })
            .then(() => {
              this.canSelectSession = true;
              this.snackbar.open("You have joined the event", null, {duration: 500});
            })
            .catch(err => {
              console.log(err);
              this.canSelectSession = true;
              this.snackbar.open("An error occurred, please try again");
              // this.snackbar.open("An error occurred, please refresh");
              // setTimeout(() => {
              //   location.reload();
              // }, 1000);
            });
        } else {
          this.canSelectSession = true;
          this.snackbar.open(
            "You have reached your max number of joined events.",
            null,
            { duration: 2000 }
          );
        }
      } else if (
        this.userDetails.requiredEventCount - this.selectedEventCount >
        0
      ) {
        this.canSelectSession = true;
        this.snackbar.open("This event is full. Try again later.", null, {
          duration: 2000
        });
      }
    }
  }
}
