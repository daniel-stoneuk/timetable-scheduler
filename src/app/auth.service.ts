import { UserDetails } from './initialise/initialise.component';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '../../node_modules/@angular/router';

export interface User {
  uid: string;
  email: string;
  initialised: boolean;
  admin: boolean;
  school: DocumentReference;
  schoolAdmin: boolean;
  userDetails: DocumentReference;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: Observable<User>;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) { }

  getUser(): Observable<User> {
    return this.afAuth.authState.pipe(switchMap(user => {
      if (user) {
        return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
      } else {
        return of(null);
      }
    }));
  }

  logout() {
    this.afAuth.auth.signOut();
  }

}
