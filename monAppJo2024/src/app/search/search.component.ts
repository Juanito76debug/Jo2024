import { Component, OnInit } from '@angular/core';
import { Membre } from '../models/membre.model';
import { UserService } from '../home/User.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  query: string = '';
  results: Membre[] = [];
  allMembers: Membre[] = [];
  userRole: string = '';
  currentUserId: number = 1; // ID de l'utilisateur actuel (à remplacer par une vraie implémentation)
  currentUserName: string = 'Martin Dupont'; // Nom de l'utilisateur actuel (à remplacer par une vraie implémentation)
  notificationMessage: string = ''; // Message de notification

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userRole = this.userService.getUserRole();
    if (this.userRole === 'admin' || this.userRole === 'member') {
      this.userService.getAllMembers().subscribe((data) => {
        this.allMembers = data;
      });
    }
  }

  onSearch() {
    if (this.userRole === 'admin' || this.userRole === 'member') {
      this.userService.searchMembers(this.query).subscribe((data) => {
        this.results = data;
      });
    } else {
      alert("Vous n'avez pas les droits pour effectuer cette recherche.");
    }
  }

  sendFriendRequest(friendId: number, friendEmail: string) {
    if (this.userRole === 'admin' || this.userRole === 'member') {
      this.userService
        .sendFriendRequest(this.currentUserId, friendId)
        .subscribe(() => {
          this.notificationMessage =
            "Demande d'ami envoyée avec succès. Statut: invitation en cours.";
          this.userService
            .sendNotificationEmail(friendEmail, this.currentUserName)
            .subscribe(() => {
              this.notificationMessage +=
                ' Email de notification envoyé avec succès.';
            });
        });
    } else {
      this.notificationMessage =
        "Vous n'avez pas les droits pour envoyer des demandes d'amis.";
    }
  }
}
