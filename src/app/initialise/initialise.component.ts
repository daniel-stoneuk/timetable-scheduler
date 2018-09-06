import { Router } from '@angular/router';
import { User } from '../auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction, DocumentChange, DocumentSnapshot } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { map, first } from 'rxjs/operators'

export interface UserDetails {
  displayName: string,
  email: string,
  requiredEventCount: number,
}

export interface School {
  name: string,
  emailDomains: string[],
  timetable: {
    dayData: {
      names: string[]
    },
    sessionData: {
      breakAfter: number[],
      count: number
    },
    weekData: {
      names: string[]
    }
  }
}

export interface SchoolId extends School { id: string }

export interface UserDetailsId extends UserDetails { id: string; }


@Component({
  selector: 'app-initialise',
  templateUrl: './initialise.component.html',
  styleUrls: ['./initialise.component.css']
})
export class InitialiseComponent implements OnInit {

  user: User;
  private userDetailsCollection: AngularFirestoreCollection<UserDetails>;
  foundSchool: SchoolId;
  foundUserDetails: UserDetailsId;
  couldNotFindDetails: boolean = false;
  couldNotFindSchool: boolean = false;

  constructor(private afs: AngularFirestore, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.user = user;
      if (this.user) {
        if (this.user.initialised) this.router.navigate(['home']);
        this.findUserDetails();
      }
    })
  }

  async findUserDetails() {
    // find school for this email domain
    try {
      let domain = this.user.email.replace(/.*@/, "");
      console.log(domain);
      const schools: SchoolId[] = await this.afs.collection<SchoolId>('schools', ref => ref.where('emailDomains', 'array-contains', domain)).snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data() as SchoolId;
        const id = a.payload.doc.id;
        return { id, ...data };
      })), first()).toPromise();
      console.log(schools);
      if (schools.length === 1) {
        this.foundSchool = schools[0];
        this.userDetailsCollection = this.afs.collection<UserDetails>(`schools/${this.foundSchool.id}/user-details`, ref => ref.where('email', '==', this.user.email));
        const userDetails = await this.userDetailsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
          const data = a.payload.doc.data() as UserDetails;
          const id = a.payload.doc.id;
          return { id, ...data };
        })), first()).toPromise();
        if (userDetails.length > 0) {
          this.foundUserDetails = userDetails[0];
        } else {
          this.couldNotFindSchool = false;
          throw { "Error": "Details not found" }
        }
      } else {
        this.couldNotFindSchool = true;
        throw { "Error": "No schools found" };
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      this.couldNotFindDetails = true;
    }
  }

  onConfirm(): void {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.user.uid}`);
    userRef.update({
      initialised: true,
      userDetails: this.foundUserDetails.id,
      school: this.foundSchool.id
    }).catch((err) => console.log(err));
    this.router.navigate(['home']);
  }
}
