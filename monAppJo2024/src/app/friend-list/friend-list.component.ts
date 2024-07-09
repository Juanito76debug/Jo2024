import { Component, OnInit } from '@angular/core';
import { UserService } from '../home/User.service';
import { Membre } from '../models/membre.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-friend-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './friend-list.component.html',
  styleUrl: './friend-list.component.scss'
})
export class FriendListComponent implements OnInit {
  friends: Membre[] = [];
  newFriendId: number | null = null;
  userId: number = 1; // ID de Martin
  errorMessage: string | null = null;
  userRole: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getFriends();
    this.getUserRole();

  }

  getUserRole(): void {
    this.userRole = this.userService.getUserRole();
  }

  getFriends(): void {
    this.userService.getFriends(this.userId).subscribe(
      (friends) => {
        this.friends = friends;
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des amis';
        console.error('Erreur lors de la récupération des amis:', error);
      }
    );
  }

  addFriend(): void {
    if (this.newFriendId) {
      this.userService.addFriend(this.userId, this.newFriendId).subscribe(
        (newFriend) => {
          this.friends.push(newFriend);
          this.newFriendId = null;
        },
        (error) => {
          this.errorMessage = 'Erreur lors de l\'ajout de l\'ami';
          console.error('Erreur lors de l\'ajout de l\'ami:', error);
        }
      );
    }
  }

  removeFriend(friendId: number): void {
    this.userService.removeFriend(this.userId, friendId).subscribe(
      () => {
        this.friends = this.friends.filter(friend => friend.id !== friendId);
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la suppression de l\'ami';
        console.error('Erreur lors de la suppression de l\'ami:', error);
      }
    );
  }
}


