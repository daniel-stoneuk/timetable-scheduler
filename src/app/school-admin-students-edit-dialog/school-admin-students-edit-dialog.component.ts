import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsId, UserDetails } from './../initialise/initialise.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '../../../node_modules/@angular/material';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'school-admin-students-edit-dialog',
  templateUrl: './school-admin-students-edit-dialog.component.html',
  styleUrls: ['./school-admin-students-edit-dialog.component.css']
})
export class SchoolAdminStudentsEditDialogComponent implements OnInit {

  constructor(
    private afs: AngularFirestore,
    public dialogRef: MatDialogRef<SchoolAdminStudentsEditDialogComponent>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  userDetails: UserDetails;

  backdropSubscription: Subscription;

  ngOnInit() {
    this.userDetails = this.data['userDetailsId'];
    if (!!!this.userDetails) {
      this.userDetails = {displayName: '', email: '', requiredEventCount: 0}
    }
    console.log(this.userDetails);

    this.backdropSubscription = this.dialogRef.backdropClick().subscribe(() => {
      this.snackbar.open("Discarded", null, { duration: 1000 });
    });
  }


  async onSubmit() {
    this.userDetails.email = this.userDetails.email.toLowerCase();
    if (!!this.data.userDetailsId) {
      console.log("Updated details!");
      let update = this.userDetails;
      // Remove Id from the data we push to firestore!
      Object.keys(update).reduce((newObj, key) => {
        if (!update[key].id) {
          newObj[key] = update[key];
        }
        return newObj;
      }, {});
      console.log(update);
      try {
        await this.afs.collection(`schools/${this.data.schoolId}/user-details`).doc(this.userDetails['id']).update(update);
        this.snackbar.open("Updated successfully", null, { duration: 1000 });
      } catch (err) {
        this.snackbar.open("Failed to update", null, { duration: 1000 });
      }
    } else {
      // Create new user
      try {
        await this.afs.collection<UserDetails>(`schools/${this.data.schoolId}/user-details`).add(this.userDetails);
        this.snackbar.open("Added new student", null, { duration: 1000 });
      } catch (err) {
        this.snackbar.open("Failed to add student", null, { duration: 1000 });
      }
    }
    this.backdropSubscription.unsubscribe();
    this.dialogRef.close();
  }
}
