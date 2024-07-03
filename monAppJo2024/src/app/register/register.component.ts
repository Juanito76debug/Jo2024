import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerData = {
    username: '',
    password: '',
    email: '',
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  validateForm() {
    if (!this.registerData.username || !this.registerData.password) {
      this.errorMessage = 'Tous les champs sont obligatoires';
      return false;
    }
    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return false;
    }
    return true;
  }

  onRegister() {
    
    console.log('Début de onRegister');
    if (this.validateForm()) {
      console.log('Formulaire valide', this.registerData);
      this.http.post('http://localhost:3000/api/auth/register', this.registerData).subscribe(
        (response: any) => {
          console.log('Réponse du serveur', response);
          if (response.success) {
            this.successMessage = 'Inscription réussie ! Un email de confirmation a été envoyé.';
            console.log('Inscription réussie');
            this.navigateToLogin();
          } else {
            this.errorMessage = 'Erreur lors de l\'inscription';
            console.log('Erreur lors de l\'inscription');
          }
        },
        (error) => {
          this.errorMessage = 'Erreur de connexion: ' + error.message;
          console.error('Erreur de connexion', error);
        }
      );
    } else {
      console.log('Formulaire invalide');
    }
    console.log('Fin de onRegister');
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}