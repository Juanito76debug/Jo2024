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
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent implements OnInit {
  friends: Membre[] = [];
  confirmedFriends: Membre[] = [];
  friendFriends: Membre[] = []; 
  friendRequests: Membre[] = [];
  friendRecommendations: Membre[] = [];
  newFriendId: number | null = null;
  userId: number = 1; // ID de Martin
  errorMessage: string | null = null;
  userRole: string = '';
  selectedFriendPseudonyme: string = ''; 

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
        this.filterConfirmedFriends();
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des amis';
        console.error('Erreur lors de la récupération des amis:', error);
      }
    );
  }

  filterConfirmedFriends(): void {
    this.confirmedFriends = this.friends.filter(friend => friend.status === 'confirmed');
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
        this.filterConfirmedFriends();
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la suppression de l\'ami';
        console.error('Erreur lors de la suppression de l\'ami:', error);
      }
    );
  }

  viewFriendFriends(friendId: number): void {
    if (this.userRole === 'admin' || this.userRole === 'member') {
      this.userService.getFriends(friendId).subscribe(
        (friends) => {
          this.friendFriends = friends.filter(friend => friend.status === 'confirmed');
          const selectedFriend = this.friends.find(friend => friend.id === friendId);
          this.selectedFriendPseudonyme = selectedFriend ? selectedFriend.pseudonyme : '';
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la récupération des amis de l\'ami';
          console.error('Erreur lors de la récupération des amis de l\'ami:', error);
        }
      );
    }
  }

  removeFriendFromFriend(friendId: number): void {
    if (this.userRole === 'admin') {
      const selectedFriend = this.friends.find(friend => friend.pseudonyme === this.selectedFriendPseudonyme);
      if (selectedFriend) {
        this.userService.removeFriend(selectedFriend.id, friendId).subscribe(
          () => {
            this.friendFriends = this.friendFriends.filter(friend => friend.id !== friendId);
          },
          (error) => {
            this.errorMessage = 'Erreur lors de la suppression de l\'ami de la liste d\'amis de ' + this.selectedFriendPseudonyme;
            console.error('Erreur lors de la suppression de l\'ami de la liste d\'amis de ' + this.selectedFriendPseudonyme, error);
          }
        );
      }
    }
  }

  acceptFriendRequest(requestId: number): void {
    if (this.userRole === 'admin' || this.userRole === 'member') {
      const selectedFriend = this.friends.find(friend => friend.pseudonyme === this.selectedFriendPseudonyme);
      if (selectedFriend) {
        this.userService.addFriend(selectedFriend.id, requestId).subscribe(
          (newFriend) => {
            this.friendFriends.push(newFriend);
            this.friendRequests = this.friendRequests.filter(request => request.id !== requestId);
          },
          (error) => {
            this.errorMessage = 'Erreur lors de l\'acceptation de la demande d\'ami';
            console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
          }
        );
      }
    }
  }

  recommendFriend(friendId: number): void {
    if (this.userRole === 'admin' || this.userRole === 'member') {
      const selectedFriend = this.friends.find(friend => friend.pseudonyme === this.selectedFriendPseudonyme);
      if (selectedFriend) {
        this.userService.recommendFriend(selectedFriend.id, friendId, this.userId).subscribe(
          (recommendation) => {
            this.friendRecommendations.push(recommendation);
          },
          (error) => {
            this.errorMessage = 'Erreur lors de la recommandation de l\'ami';
            console.error('Erreur lors de la recommandation de l\'ami:', error);
          }
        );
      }
    }
  }

  acceptFriendRecommendation(recommendationId: number): void {
    if (this.userRole === 'admin' || this.userRole === 'member') {
      const selectedFriend = this.friends.find(friend => friend.pseudonyme === this.selectedFriendPseudonyme);
      if (selectedFriend) {
        this.userService.addFriend(selectedFriend.id, recommendationId).subscribe(
          (newFriend) => {
            this.friendFriends.push(newFriend);
            this.friendRecommendations = this.friendRecommendations.filter(recommendation => recommendation.id !== recommendationId);
          },
          (error) => {
            this.errorMessage = 'Erreur lors de l\'acceptation de la recommandation d\'ami';
            console.error('Erreur lors de l\'acceptation de la recommandation d\'ami:', error);
          }
        );
      }
    }
  }
}