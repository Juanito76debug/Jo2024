import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };

  errorMessage: string= '' ;

  constructor( private http: HttpClient, private router: Router) {}

  onLogin() {
    console.log('onLogin');
    this.http.post('http://localhost:3000/api/auth/login', this.loginData).subscribe(
      (response: any) => {
        console.log('Connexion réussie', response);
        if (response.success) {
          this.router.navigate(['/dashboard']); // Redirection après connexion réussie
        } else {
          this.errorMessage = 'Identifiants incorrects';
        }
      },
      (error) => {
        this.errorMessage = 'Erreur de connexion: ' + error.message;
        console.error('Erreur de connexion', error);
      }
    );
    // // Appel au service d'authentification pour vérifier les identifiants
    // this.authService.login(this.loginData.username, this.loginData.password).subscribe(
    //   (response) => {
    //     // Si la connexion est réussie, vous pouvez rediriger l'utilisateur ou faire d'autres actions
    //     console.log('Connexion réussie', response);
    //   },
    //   (error) => {
    //     // Gérer les erreurs de connexion ici
    //     console.error('Erreur de connexion', error);
    //   }
    // );
  }

}
