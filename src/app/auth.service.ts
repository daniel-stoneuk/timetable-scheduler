import { UserDetails } from './initialise/initialise.component';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

export interface User {
  uid: string;
  email: string;
  initialised?: boolean;
  admin?: boolean;
  school?: string;
  schoolAdmin?: boolean;
  userDetails?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<User>;

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
