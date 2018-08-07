import { UserDetails } from './../initialise/initialise.component';
import { BreakpointState, Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { first } from 'rxjs/operators';
import { AuthService, User } from './../auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SchoolAdminStudentsDataSource } from './school-admin-students-datasource';
import { SchoolAdminStudentsEditDialogComponent } from '../school-admin-students-edit-dialog/school-admin-students-edit-dialog.component';
import { Observable } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-school-admin-students',
  templateUrl: './school-admin-students.component.html',
  styleUrls: ['./school-admin-students.component.css']
})
export class SchoolAdminStudentsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: SchoolAdminStudentsDataSource;

  isExtraSmall: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.XSmall);

  constructor(private breakpointObserver: BreakpointObserver,private afs: AngularFirestore, private authService: AuthService, private matDialog: MatDialog) { }

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'displayName', 'email', 'requiredEventCount', 'eventCount', 'edit'];

  user: User;

  ngOnInit() {
    this.dataSource = new SchoolAdminStudentsDataSource(this.afs, this.authService, this.paginator, this.sort);
    this.authService.getUser().subscribe((user) => this.user = user);
    
  }

  async addStudent() {
    this.openEditDialog(undefined);
  }

  async openEditDialog(userDetailsId) {
    console.log("Open Edit Dialog");
    try {
      let schoolId = this.user.school;
      console.log("School Id: " + schoolId);
      let dialogRef = this.matDialog.open(SchoolAdminStudentsEditDialogComponent, {
        data: { schoolId: schoolId, userDetailsId: userDetailsId },
        width: '50%',
        height: '50%',
        maxWidth: '100vw',
        maxHeight: '100vh'
      });
      const smallDialogSub = this.isExtraSmall.subscribe(result => {
        if (result.matches) {
          dialogRef.updateSize('100%', '100%');
        } else {
          dialogRef.updateSize('50%', '50%');
        }
      });
      dialogRef.afterClosed().subscribe(() => smallDialogSub.unsubscribe());
    } catch (err) {
      console.log(err);
    }
  }
}
