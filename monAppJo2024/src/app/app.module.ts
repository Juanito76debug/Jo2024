import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { LogoutComponent } from './logout/logout.component';
import { AuthService } from './home/auth.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile.component';
import { UserService } from './home/User.service';





// Définition des routes
const routes: Routes = [
  { path: 'accueil', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  {path: 'deconnexion', loadComponent: () => import('./logout/logout.component').then(m => m.LogoutComponent)},
  {path: 'Mot de passe oublié', loadComponent: ()=>import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)},
  {path: 'profile', loadComponent: ()=>import('./profile/profile.component').then(m => m.ProfileComponent)},
  
    
      // ... autres routes enfants ...
    ];
  
  // ... autres routes ...


// Définition du module
@NgModule({
  declarations: [
    
    // ... autres déclarations de composants
  ],
  imports: [FormsModule, BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [provideHttpClient(withFetch()),AuthService, UserService], 

})
export class AppModule { }