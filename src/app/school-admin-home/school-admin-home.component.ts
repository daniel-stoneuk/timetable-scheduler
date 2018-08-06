import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, User } from './../auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit } from '@angular/core';
import { School } from '../initialise/initialise.component';

@Component({
  selector: 'app-school-admin-home',
  templateUrl: './school-admin-home.component.html',
  styleUrls: ['./school-admin-home.component.css']
})
export class SchoolAdminHomeComponent implements OnInit {

  user: User;
  schoolDetailsJson: string;

  constructor(
    private afs: AngularFirestore, private authService: AuthService, private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      this.user = user;
      this.afs.collection("/schools").doc<School>(this.user.school).valueChanges().subscribe(school => {
        this.schoolDetailsJson = JSON.stringify(school, null, 4);
      });
    });
  }

  async onSubmit() {
    try {
      let school: School = JSON.parse(this.schoolDetailsJson);
      let result = await this.afs.collection('/schools').doc(this.user.school).set(school);
      this.snackbar.open("Updated", null, { duration: 2000 });
    } catch (err) {
      this.snackbar.open("Error parsing JSON: " + err, null, { duration: 2000 });
    }
  }

}
