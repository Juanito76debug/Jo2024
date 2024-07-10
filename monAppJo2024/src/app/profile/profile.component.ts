import { Component, OnInit } from '@angular/core';
import { UserService } from '../home/User.service';
import { CommonModule } from '@angular/common';
import { Membre } from '../models/membre.model';
import { FormsModule } from '@angular/forms';
import { AuthService, UserType } from '../home/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: Membre | null = null; // Initialisation à null
  userRole: UserType | null = null;
  isFriendOfMartin: boolean | null = null;
  editing: boolean = false;
  selectedFriendId: number | null = null;
  martinsFriends: Membre[] = [];
  confirmedFriends: Membre[] = []; // Ajout d'une variable pour les amis confirmés
  selectedUserId: number | null = null;
  allUsers: Membre[] = [];
  confirmationMessage: string | null = null; // Ajout d'une variable pour le message de confirmation
  ignoreMessage: string | null = null; // Ajout d'une variable pour le message d'ignorance
  recommendationMessage: string | null = null; // Ajout d'une variable pour le message de recommandation
  ignoreRecommendationMessage: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.userRole = this.authService.getUserType(); // Assurez-vous que cette méthode retourne une valeur
    this.checkIfFriendOfMartin();
    this.loadConfirmedFriends();
  }

  getUserProfile(): void {
    const userId = 1; // Remplace par l'ID de l'utilisateur actuel
    this.userService.getUserProfile(userId).subscribe(
      (user: Membre) => {
        this.user = user;
      },
      (error) => {
        console.error('Erreur lors de la récupération du profil utilisateur:', error);
      }
    );
  }

  checkIfFriendOfMartin(): void {
    const currentUserId = 1; // Remplacez par l'ID de l'utilisateur actuel
    this.authService.isFriendOfMartin(currentUserId).subscribe(
      (isFriend: boolean) => {
        this.isFriendOfMartin = isFriend;
      },
      (error) => {
        console.error('Erreur lors de la vérification des amis de Martin:', error);
      }
    );
  }

  loadConfirmedFriends(): void {
    const userId = 1; // Remplace par l'ID de l'utilisateur actuel
    this.userService.getFriends(userId).subscribe(
      (friends: Membre[]) => {
        this.confirmedFriends = friends.filter(friend => friend.status === 'confirmed');
      },
      (error) => {
        console.error('Erreur lors de la récupération des amis confirmés:', error);
      }
    );
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

  deleteUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce profil ?')) {
      this.userService.deleteUser(userId).subscribe(
        (response) => {
          alert('Profil supprimé avec succès.');
          this.router.navigate(['/home']); // Redirigez vers la page d'accueil après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression du profil:', error);
          alert('Une erreur est survenue lors de la suppression du profil.');
        }
      );
    }
  }

  deleteAllUsers(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les profils ?')) {
      this.userService.deleteAllUsers().subscribe(
        (response) => {
          alert('Tous les profils ont été supprimés avec succès.');
          this.router.navigate(['/home']); // Redirigez vers la page d'accueil après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression de tous les profils:', error);
          alert('Une erreur est survenue lors de la suppression de tous les profils.');
        }
      );
    }
  }

  confirmFriendRequest(requesterId: number): void {
    if (this.user) {
      this.userService.confirmFriendRequest(requesterId, this.user.id).subscribe(
        (response) => {
          // Gérer la réponse après la confirmation de la demande d'ami
          this.confirmationMessage = 'Demande d\'ami confirmée avec succès.';
          // Mettre à jour la liste des amis si nécessaire
        },
        (error) => {
          console.error('Erreur lors de la confirmation de la demande d\'ami:', error);
          alert('Une erreur est survenue lors de la confirmation de la demande d\'ami.');
        }
      );
    } else {
      console.error('Erreur: Aucun utilisateur pour confirmer la demande d\'ami.');
    }
  }

  ignoreFriendRequest(requesterId: number): void {
    if (this.user) {
      this.userService.ignoreFriendRequest(requesterId, this.user.id).subscribe(
        (response) => {
          // Gérer la réponse après l'ignorance de la demande d'ami
          this.ignoreMessage = 'Demande d\'ami ignorée avec succès.';
          // Mettre à jour la liste des amis si nécessaire
        },
        (error) => {
          console.error('Erreur lors de l\'ignorance de la demande d\'ami:', error);
          alert('Une erreur est survenue lors de l\'ignorance de la demande d\'ami.');
        }
      );
    } else {
      console.error('Erreur: Aucun utilisateur pour ignorer la demande d\'ami.');
    }
  }

  recommendFriend(friendId: number | null): void {
    if (this.user && friendId !== null) {
      this.userService.recommendFriend(this.user.id, friendId, this.user.id).subscribe(
        (response) => {
          // Gérer la réponse après la recommandation d'un ami
          this.recommendationMessage = 'Ami recommandé avec succès.';
        },
        (error) => {
          console.error('Erreur lors de la recommandation de l\'ami:', error);
          alert('Une erreur est survenue lors de la recommandation de l\'ami.');
        }
      );
    } else {
      console.error('Erreur: Aucun utilisateur pour recommander un ami ou ami non sélectionné.');
    }
  }
  sendRecommendationEmail(friendId: number): void {
    if (this.user) {
      const friend = this.confirmedFriends.find(f => f.id === friendId);
      if (friend) {
        this.userService.sendRecommendationEmail(friend.email, this.user.pseudonyme, friend.pseudonyme).subscribe(
          (response) => {
            console.log('Notification par e-mail envoyée avec succès.');
          },
          (error) => {
            console.error('Erreur lors de l\'envoi de la notification par e-mail:', error);
          }
        );
      }
    }
  }
}