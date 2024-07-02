import { Component } from '@angular/core';
import { AuthService } from '../home/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout(); 
    // test

        // Ici, vous pouvez ajouter votre logique de déconnexion
      console.log('Utilisateur déconnecté');
  
      // Redirection vers la page d'accueil
      this.router.navigate(['/accueil']);
  }

}
