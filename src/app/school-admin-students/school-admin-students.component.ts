import { MatSnackBar } from "@angular/material/snack-bar";
import { async } from "@angular/core/testing";
import { UserDetails, SchoolId } from "./../initialise/initialise.component";
import {
  BreakpointState,
  Breakpoints,
  BreakpointObserver
} from "@angular/cdk/layout";
import { first, take, map } from "rxjs/operators";
import { AuthService, User } from "./../auth.service";
import { AngularFirestore } from "angularfire2/firestore";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatDialog } from "@angular/material";
import { SchoolAdminStudentsDataSource } from "./school-admin-students-datasource";
import { SchoolAdminStudentsEditDialogComponent } from "../school-admin-students-edit-dialog/school-admin-students-edit-dialog.component";
import { Observable } from "../../../node_modules/rxjs";
import { UserDetailsId } from "../initialise/initialise.component";
import { SchoolAdminStudentsEventsDialogComponent } from "../school-admin-students-events-dialog/school-admin-students-events-dialog.component";
import { saveAs } from 'file-saver/FileSaver';

@Component({
  selector: "app-school-admin-students",
  templateUrl: "./school-admin-students.component.html",
  styleUrls: ["./school-admin-students.component.css"]
})
export class SchoolAdminStudentsComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource: SchoolAdminStudentsDataSource;

  requiredSessions: string;
  emails: string;

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.XSmall
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private afs: AngularFirestore,
    private authService: AuthService,
    private matDialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    "id",
    "displayName",
    "email",
    "requiredEventCount",
    "edit"
  ];

  user: User;
  school: SchoolId;

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      this.user = user;
      this.afs
        .collection("/schools")
        .doc<SchoolId>(this.user.school)
        .valueChanges()
        .subscribe(school => {
          this.school = { id: this.user.school, ...school };
        });
    });
    this.dataSource = new SchoolAdminStudentsDataSource(
      this.afs,
      this.authService,
      this.paginator,
      this.sort
    );
  }

  async addStudent() {
    this.openEditDialog(undefined);
  }

  async copyId(userDetailsId: UserDetailsId) {
    this.copyMessage(userDetailsId.id);
    this.snackbar.open("Copied user details id: " + userDetailsId.id, null, { duration: 1000 });
  }

  copyMessage(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  async openEventDialog(userDetailsId) {
    console.log("Open Event Dialog");
    let schoolId = this.user.school;
    let dialogRef = this.matDialog.open(
      SchoolAdminStudentsEventsDialogComponent,
      {
        data: { school: this.school, schoolId: schoolId, userDetailsId: userDetailsId },
        width: "50%",
        height: "60%",
        maxWidth: "100vw",
        maxHeight: "100vh"
      }
    );
    const smallDialogSub = this.isExtraSmall.subscribe(result => {
      if (result.matches) {
        dialogRef.updateSize("100%", "100%");
      } else {
        dialogRef.updateSize("50%", "50%");
      }
    });
    dialogRef.afterClosed().subscribe(() => smallDialogSub.unsubscribe());
  }

  async uploadRequiredSessions() {
    let sessionCounts = this.requiredSessions.split(";");
    let schoolId = this.user.school;
    for (let user of sessionCounts) {
      if (user != "") {
        console.log(user);
        let name = user.split(",")[0];
        let firstName = name.split(" ")[1].toLowerCase();
        let lastName = name.split(" ")[0].toLowerCase();
        let fullName =
          firstName.charAt(0).toUpperCase() +
          firstName.slice(1) +
          " " +
          lastName.charAt(0).toUpperCase() +
          lastName.slice(1);
        let sessionCount = user.split(",")[1];
        let matchedUserDetails = await this.afs
          .collection<UserDetailsId>(`schools/${schoolId}/user-details`, ref =>
            ref.where("displayName", "==", fullName)
          )
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(a => {
                const data = a.payload.doc.data() as UserDetails;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            ),
            take(1)
          )
          .toPromise();
        console.log(
          fullName +
            " - " +
            sessionCount +
            " - " +
            JSON.stringify(matchedUserDetails)
        );
        if (matchedUserDetails.length > 0) {
          // User exists
          let userDetails = matchedUserDetails[0];
          console.log("Already Exists");
          userDetails.requiredEventCount = +sessionCount;
          let update = userDetails;
          // Remove Id from the data we push to firestore!
          Object.keys(update).reduce((newObj, key) => {
            if (!update[key].id) {
              newObj[key] = update[key];
            }
            return newObj;
          }, {});
          console.log(update);
          try {
            await this.afs
              .collection(`schools/${schoolId}/user-details`)
              .doc(userDetails["id"])
              .update(update);
            console.log("Updated successfully");
          } catch (err) {
            console.log("Update failed");
          }
        } else {
          // User does not exist
          let userDetails = {
            displayName: fullName,
            email: "",
            requiredEventCount: +sessionCount,
            events: []
          };

          try {
            await this.afs
              .collection<UserDetails>(`schools/${schoolId}/user-details`)
              .add(userDetails);
            console.log("added new student successfully");
          } catch (err) {
            console.log("added new student unsuccessfully");
          }
        }
      }
    }
  }

  async delete(userDetailsId: UserDetailsId) {
    console.log("Delete userDetailsId");
    this.afs
      .collection(`schools/${this.user.school}/user-details`)
      .doc(userDetailsId.id)
      .delete()
      .then(() => this.snackbar.open("Deleted event", null, { duration: 1000 }))
      .catch(() =>
        this.snackbar.open("Failed to delete event", null, { duration: 1000 })
      );
  }

  async uploadEmails() {
    let users = this.emails.split(";");
    let schoolId = this.user.school;
    for (let user of users) {
      if (user != "") {
        console.log(user);
        let name = user.split(",")[0];
        let email = user.split(",")[1].toLowerCase();
        let matchedUserDetails = await this.afs
          .collection<UserDetailsId>(`schools/${schoolId}/user-details`, ref =>
            ref.where("displayName", "==", name)
          )
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(a => {
                const data = a.payload.doc.data() as UserDetails;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            ),
            take(1)
          )
          .toPromise();
        console.log(
          name + " - " + email + " - " + JSON.stringify(matchedUserDetails)
        );
        if (matchedUserDetails.length > 0) {
          // User exists
          let userDetails = matchedUserDetails[0];
          console.log("Already Exists");
          userDetails.email = email;
          let update = userDetails;
          // Remove Id from the data we push to firestore!
          Object.keys(update).reduce((newObj, key) => {
            if (!update[key].id) {
              newObj[key] = update[key];
            }
            return newObj;
          }, {});
          console.log(update);
          try {
            await this.afs
              .collection(`schools/${schoolId}/user-details`)
              .doc(userDetails["id"])
              .update(update);
            console.log("Updated successfully");
          } catch (err) {
            console.log("Update failed");
          }
        } else {
          // User does not exist
          let userDetails = {
            displayName: name,
            email: email,
            requiredEventCount: 0,
            events: []
          };

          try {
            await this.afs
              .collection<UserDetails>(`schools/${schoolId}/user-details`)
              .add(userDetails);
            console.log("added new student successfully");
          } catch (err) {
            console.log("added new student unsuccessfully");
          }
        }
      }
    }
  }
  async openEditDialog(userDetailsId) {
    console.log("Open Edit Dialog");
    try {
      let schoolId = this.user.school;
      console.log("School Id: " + schoolId);
      let dialogRef = this.matDialog.open(
        SchoolAdminStudentsEditDialogComponent,
        {
          data: { schoolId: schoolId, userDetailsId: userDetailsId },
          width: "50%",
          height: "50%",
          maxWidth: "100vw",
          maxHeight: "100vh"
        }
      );
      const smallDialogSub = this.isExtraSmall.subscribe(result => {
        if (result.matches) {
          dialogRef.updateSize("100%", "100%");
        } else {
          dialogRef.updateSize("50%", "50%");
        }
      });
      dialogRef.afterClosed().subscribe(() => smallDialogSub.unsubscribe());
    } catch (err) {
      console.log(err);
    }
  }
}
