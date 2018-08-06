import { SchoolAdminStudentsComponent } from './../school-admin-students/school-admin-students.component';
import { SchoolAdminGuard } from './../school-admin.guard';
import { SchoolAdminComponent } from './../school-admin/school-admin.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchoolAdminHomeComponent } from '../school-admin-home/school-admin-home.component';
import { SchoolAdminEventsComponent } from '../school-admin-events/school-admin-events.component';

const schoolAdminRoutes: Routes = [
  {
    path: 'school-admin', component: SchoolAdminComponent, canActivate: [SchoolAdminGuard], children: [
      {
        path: '', children:  [
          { path: '', redirectTo: 'home', pathMatch: 'full'},
          { path: 'home', component: SchoolAdminHomeComponent },
          { path: 'students', component: SchoolAdminStudentsComponent },
          { path: 'events', component: SchoolAdminEventsComponent }
        ]
      }

    ]
  }
]

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forChild(schoolAdminRoutes)
  ]
})
export class SchoolAdminRoutingModule { }