import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  email: string = '';
  errorMessage: string = '';
  emailSent: boolean = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    console.log('Form submitted with email:', this.email); // Débogage initial

    if (this.email) {
      console.log('Sending POST request to /api/forgot-password'); // Débogage avant l'appel HTTP

      this.http.post('http://localhost:3000/api/forgot-password', { email: this.email })
        .subscribe(
          response => {
            console.log('Response received:', response); // Débogage de la réponse
            this.errorMessage = ''; // Réinitialiser le message d'erreur en cas de succès
            this.emailSent = true; // Afficher le message de confirmation
          },
          error => {
            console.error('Error occurred:', error); // Débogage de l'erreur
            this.errorMessage = 'Adresse email non trouvée. Veuillez réessayer.';
          }
        );
    } else {
      console.warn('Email field is empty'); // Débogage si le champ email est vide
    }
  }
}