import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';




// Définition des routes
const routes: Routes = [
  { path: 'accueil', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    
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
  providers: [provideHttpClient(withFetch())]

})
export class AppModule { }