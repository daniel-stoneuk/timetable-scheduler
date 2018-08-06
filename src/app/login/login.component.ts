import { User } from '../auth.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { async } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar'
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  firebaseUser: firebase.User;
  user: User;
  loggedIn: boolean = false;
  email: string;
  emailSent = false;

  errorMessage: string;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(firebaseUser => {
      this.firebaseUser = firebaseUser;
      console.log(this.firebaseUser);
      if (this.firebaseUser == null) {
        const url = this.router.url;
        this.confirmSignIn(url);
      } else {
        this.router.navigate(['home']);
      }
    });
  }

  async confirmSignIn(url: string) {
    try {
      console.log("Confirm sign in");
      if (this.afAuth.auth.isSignInWithEmailLink(url)) {
        console.log("Is correct link");
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email address for confirmation');
        }
        const result = await this.afAuth.auth.signInWithEmailLink(email, url);
        window.localStorage.removeItem('emailForSignIn');
        this.updateUserData(this.firebaseUser);
        if (this.firebaseUser) {
          this.router.navigate(['home']);
        }
      }
    } catch (err) {
      this.errorMessage = err.message;
      this.displayErrorSnackBar();
    }
  }

  async updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    
    const data: User = {
      uid: user.uid,
      email: user.email,
    }

    console.log("Creating user: " + data);

    return userRef.set(data, { merge: true })

  }

  async sendEmailLink() {
    const actionCodeSettings = {
      // url: 'http://localhost:4200/login',
      url: 'https://choose-when.daniel-stone.uk/login',
      handleCodeInApp: true
    };

    try {
      this.email = this.email.toLowerCase();
      this.emailSent = true;
      await this.afAuth.auth.sendSignInLinkToEmail(this.email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', this.email);
      let snackBarRef = this.snackBar.open("We sent an email to " + this.email + " with your login link. Use the most recent link. If you did not receive an email, please check your spam or junk folder.");

    } catch (err) {
      this.emailSent = false;
      this.errorMessage = err.message;
      this.displayErrorSnackBar();
    }
  }

  displayErrorSnackBar() {
    let snackBarRef = this.snackBar.open(this.errorMessage, null, { duration: 3000 });
  }


}
