import { Component, OnInit } from '@angular/core';
import { UserService } from '../home/User.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `<h1>Page Admin</h1>`,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  users: any[] = []; // Liste des utilisateurs pour l'administration

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Appel au service pour récupérer la liste des utilisateurs
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }

  deleteUser(userId: number): void {
    // Appel au service pour supprimer un utilisateur
    this.userService.deleteUser(userId).subscribe(
      (response) => {
        console.log('Utilisateur supprimé avec succès', response);
        // Recharger la liste des utilisateurs après la suppression
        this.loadUsers();
      },
      (error) => {
        console.error('Erreur lors de la suppression de l\'utilisateur', error);
      }
    );
  }

  // Ajoutez d'autres méthodes pour la gestion des contenus, la visualisation de statistiques, etc.
}


