import { PrivacyPolicyComponent } from './../privacy-policy/privacy-policy.component';
import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'
import { InitialiseComponent } from '../initialise/initialise.component';
import { SchoolAdminComponent } from '../school-admin/school-admin.component';
import { AuthGuard } from '../auth.guard';
import { SchoolAdminGuard } from '../school-admin.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'initialise', component: InitialiseComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'privacy-policy', component: PrivacyPolicyComponent},
]

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
