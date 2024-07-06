import { Component, OnInit } from '@angular/core';
import { UserService } from '../home/User.service';
import { CommonModule } from '@angular/common';
import { Membre, martin } from '../models/membre.model';
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
}
