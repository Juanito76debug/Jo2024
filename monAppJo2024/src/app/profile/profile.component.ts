import { Component, OnInit } from '@angular/core';
import { UserService } from '../home/User.service';
import { CommonModule } from '@angular/common';
import { Membre } from '../models/membre.model';
import { FormsModule } from '@angular/forms';
import { AuthService, UserType } from '../home/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: Membre | null = null; // Initialisation à null
  userRole: UserType | null = null;
  isFriendOfMartin: boolean | null = null;
  editing: boolean = false;
  selectedFriendId: number | null = null;
  martinsFriends: Membre[] = [];
  selectedUserId: number | null = null;
  allUsers: Membre[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.userRole = this.authService.getUserType(); // Assurez-vous que cette méthode retourne une valeur
    this.checkIfFriendOfMartin();
  }

  getUserProfile(): void {
    // Votre logique pour récupérer le profil de l'utilisateur
  }

  checkIfFriendOfMartin(): void {
    const currentUserId = 1; // Remplacez par l'ID de l'utilisateur actuel
    this.isFriendOfMartin = this.authService.isFriendOfMartin(currentUserId);
  }

  enableEditing(): void {
    this.editing = true; // Active le mode d'édition
  }

  onSubmit(): void {
    if (this.user) {
      this.userService.updateUser(this.user).subscribe(
        (response) => {
          // Gérer la réponse
          this.editing = false; // Désactivez le mode d'édition après la mise à jour
          // Mettre à jour la liste des utilisateurs si nécessaire
        },
        (error) => {
          // Gérer les erreurs
        }
      );
    } else {
      console.error('Erreur: Aucun utilisateur à mettre à jour.');
    }
  }
  onSelectFriend(): void {
    // Trouvez l'ami sélectionné par son ID
    const friend = this.martinsFriends.find(
      (f) => f.id === this.selectedFriendId
    );
    if (friend) {
      this.user = friend; // Préparez l'ami sélectionné pour la modification
      this.editing = true; // Activez le mode d'édition
    }
  }
  onSelectUser(): void {
    // Trouvez l'utilisateur sélectionné par son ID
    const user = this.allUsers.find((u) => u.id === this.selectedUserId);
    if (user) {
      this.user = user; // Préparez l'utilisateur sélectionné pour la modification
      this.editing = true; // Activez le mode d'édition
    }
  }
}
