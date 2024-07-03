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
    if (this.email) {
      this.http.post('/api/forgot-password', { email: this.email })
        .subscribe(
          response => {
            console.log('Email de récupération envoyé');
            this.errorMessage = ''; // Réinitialiser le message d'erreur en cas de succès
            this.emailSent = true; // Afficher le message de confirmation
          },
          error => {
            console.error('Erreur lors de l\'envoi de l\'email', error);
            this.errorMessage = 'Adresse email non trouvée. Veuillez réessayer.';
          }
        );
    }
  }
}