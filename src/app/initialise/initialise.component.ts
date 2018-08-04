import { Router } from '@angular/router';
import { User } from './../auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentChangeAction, DocumentChange, DocumentSnapshot } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { map } from 'rxjs/operators'

export interface UserDetails {
  displayName: string,
  email: string,
  requiredSessionCount: number
}
export interface UserDetailsId extends UserDetails { id: string; }


@Component({
  selector: 'app-initialise',
  templateUrl: './initialise.component.html',
  styleUrls: ['./initialise.component.css']
})
export class InitialiseComponent implements OnInit {

  user: User;
  private userDetailsCollection: AngularFirestoreCollection<UserDetails>;
  foundUserDetails: UserDetailsId;
  couldNotFindDetails: boolean = false;

  constructor(private afs: AngularFirestore, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.user = user;
      if (this.user.initialised) this.router.navigate(['home']);

      this.userDetailsCollection = this.afs.collection<UserDetails>('user-details', ref => ref.where('email', '==', user.email));
      this.userDetailsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data() as UserDetails;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))).subscribe(userDetails => {
        if (userDetails.length > 0) {
          this.foundUserDetails = userDetails[0];
        } else {
          this.couldNotFindDetails = true;
        }
      })
    })
  }

  onConfirm(): void {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.user.uid}`);
    const userDetailsRef: AngularFirestoreDocument<any> = this.afs.doc(`user-details/${this.foundUserDetails.id}`);
    userRef.update({
      initialised: true,
      userDetails: userDetailsRef.ref
    });
    this.router.navigate(['home']);
  }
}
