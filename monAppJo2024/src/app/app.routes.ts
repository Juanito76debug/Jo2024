import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Component } from '@angular/core';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { FriendListComponent } from './friend-list/friend-list.component';


export const routes: Routes = [

{ path:'accueil' , component: HomeComponent},
{ path: 'auth', component: AuthComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {path: 'logout', component: LogoutComponent },
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: {requiredType:'admin'}},
  {path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { expectedRoles: ['admin', 'member'] }},
    {path: 'amis', component: FriendListComponent, canActivate: [AuthGuard], data: {expectedRoles: ['admin','member']}},
  
  
  


];
