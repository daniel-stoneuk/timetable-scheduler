import { AuthService } from './../auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { SchoolAdminStudentsDataSource } from './school-admin-students-datasource';

@Component({
  selector: 'app-school-admin-students',
  templateUrl: './school-admin-students.component.html',
  styleUrls: ['./school-admin-students.component.css']
})
export class SchoolAdminStudentsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: SchoolAdminStudentsDataSource;

  constructor(private afs: AngularFirestore, private authService: AuthService) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'displayName', 'email', 'requiredSessionCount'];

  ngOnInit() {
    this.dataSource = new SchoolAdminStudentsDataSource(this.afs, this.authService, this.paginator, this.sort);
  }
}
