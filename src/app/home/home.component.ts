import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '../../../node_modules/angularfire2/firestore';

interface Event {
  capacity: number;
  name: string;
}

interface Session {
  week: number
  day: number;
  number: number;
  event: Event;
}

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  sessionCollection: AngularFirestoreCollection<Session>;

  week1SessionCollection: AngularFirestoreCollection<Session>;
  week1Sessions: Session[];

  week2SessionCollection: AngularFirestoreCollection<Session>;
  week2Sessions: Session[];

  constructor(private afs: AngularFirestore) { }

  addSession: Session = {
    week: null,
    day: null,
    number: null,
    event: null
  };

  ngOnInit() {
    this.sessionCollection = this.afs.collection("sessions");
    this.week1SessionCollection = this.afs.collection("sessions", ref => ref.where('week', '==', 0));
    this.week1SessionCollection.valueChanges()
      .pipe(map(sessions => {
        sessions.sort(this.compare);
        return sessions;
      }))
      .subscribe(sessions => this.week1Sessions = sessions);

    this.week2SessionCollection = this.afs.collection("sessions", ref => ref.where('week', '==', 1));
    this.week2SessionCollection.valueChanges()
      .pipe(map(sessions => {
        sessions.sort(this.compare);
        for (var num = 0; num < 5; num++) {
          sessions.splice(6 * 5, 0, { week: null, day: null, number: null, event: null });
        }
        return sessions;
      }))
      .subscribe(sessions => this.week2Sessions = sessions);

  }

  onSubmit() {
    console.log(this.addSession);
    this.sessionCollection.add(this.addSession);
  }

  compare(a, b) {
    if (a.week < b.week)
      return -1;
    if (a.week > b.week)
      return 1
    if (a.number < b.number)
      return -1;
    if (a.number > b.number)
      return 1;
    if (a.day < b.day)
      return -1;
    if (a.day > b.day)
      return 1;
    return 0;
  };

}
