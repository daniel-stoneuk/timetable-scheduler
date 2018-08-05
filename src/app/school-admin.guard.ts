import { InitialiseComponent } from './initialise/initialise.component';
import { map, take, tap, first } from 'rxjs/operators';
import { AuthService, User } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SchoolAdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.getUser()
      .pipe(map(user => {
        if (user) {
          console.log('Initialised: ' + !!!user.initialised);
          if (!!!user.schoolAdmin) {
            console.log('Access Denied');
            this.router.navigate(['home']);
            return false;
          }
          return true;
        } else {
          console.log('Access Denied: Not logged in');
          this.router.navigate(['login']);
          return false;
        }
      }), take(1));
  }
}
