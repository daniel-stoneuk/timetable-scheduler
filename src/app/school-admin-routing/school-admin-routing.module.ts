import { SchoolAdminStudentsComponent } from './../school-admin-students/school-admin-students.component';
import { SchoolAdminGuard } from './../school-admin.guard';
import { SchoolAdminComponent } from './../school-admin/school-admin.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const schoolAdminRoutes: Routes = [
  {
    path: 'school-admin', component: SchoolAdminComponent, canActivate: [SchoolAdminGuard], children: [
      {
        path: '', children:  [
          { path: '', redirectTo: 'students', pathMatch: 'full'},
          { path: 'students', component: SchoolAdminStudentsComponent },
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