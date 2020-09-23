import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RegisterComponent} from './components/register/register.component';
import {LoginComponent} from './components/login/login.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';


const routes: Routes = [

  // default page
  {path: '', redirectTo: 'login', pathMatch: 'full'},

  // accessible for everyone
  {path: 'user-account', component: UserProfileComponent},
  {path: 'login', component: LoginComponent},
  {path: 'login?token=', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
