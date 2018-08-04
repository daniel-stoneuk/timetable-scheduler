import { AuthService } from './auth.service';
import { auth } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Router } from '../../node_modules/@angular/router';
import { AngularFirestore } from '../../node_modules/angularfire2/firestore';
import { User } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  loggedIn: boolean = true;
  user: User;
    
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, public authService: AuthService, private router: Router) {}

  ngOnInit() {
   this.authService.getUser().subscribe(user => {
      this.user = user;
      console.log(this.user);
      if (this.user == null) {
        this.loggedIn = false;
        this.router.navigate(['login']);
      } else {
        this.loggedIn = true;
        // Check if user is initialised
        if (!this.user.initialised) {
          this.router.navigate(['initialise']);
        }
      }
    });
  }
  
}
