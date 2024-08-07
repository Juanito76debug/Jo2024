import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Membre } from '../models/membre.model';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
  private socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000');
  }

  getAllUsers(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      this.socket.emit('requestAllUsers');
      this.socket.on('allUsers', (users: any[]) => {
        observer.next(users);
      });
    });
  }

  // Méthode pour supprimer un utilisateur
  deleteUser(userId: number): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.emit('deleteUser', userId);
      this.socket.on('userDeleted', (response: any) => {
        observer.next(response);
        observer.complete();
      });
      this.socket.on('error', (error: any) => {
        observer.error(error);
      });
    });
  }

  deleteAllUsers(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.emit('deleteAllUsers');
      this.socket.on('allUsersDeleted', (response: any) => {
        observer.next(response);
        observer.complete();
      });
      this.socket.on('error', (error: any) => {
        observer.error(error);
      });
    });
  }

  // Simule le suivi des utilisateurs connectés
  getConnectedUsersCount(): Observable<number> {
    return new Observable<number>((observer) => {
      this.socket.on('userCount', (count: number) => {
        observer.next(count);
      });
    });
  }
  getAllMembers(): Observable<Membre[]> {
    return this.http
      .get<Membre[]>(this.apiUrl)
      .pipe(catchError(this.handleError<Membre[]>('getAllMembers', [])));
  }
  getUserRole(): string {
    // Simule l'obtention du rôle de l'utilisateur (à remplacer par une vraie implémentation)
    return 'member'; // ou 'admin'
  }
  updateUser(user: Membre): Observable<Membre> {
    console.log("Mise à jour de l'utilisateur:", user); // Débogage: affiche les informations de l'utilisateur

    // Émission d'un événement socket pour débuter la mise à jour
    this.socket.emit('updateUserRequest', user);

    // Écoute de la réponse du serveur via socket
    this.socket.on('updateUserResponse', (response: any) => {
      console.log('Réponse du serveur:', response); // Débogage: affiche la réponse du serveur
    });

    // Effectue la requête HTTP PUT pour mettre à jour l'utilisateur
    return this.http
      .put<Membre>(`${this.apiUrl}/${user.id}`, user)
      .pipe(catchError(this.handleError<Membre>('updateUser')));
  }
  getUserProfile(userId: number): Observable<Membre> {
    return this.http
      .get<Membre>(`${this.apiUrl}/${userId}`)
      .pipe(catchError(this.handleError<Membre>('getUserProfile')));
  }
  getFriends(userId: number): Observable<Membre[]> {
    return this.http
      .get<Membre[]>(`${this.apiUrl}/${userId}/friends`)
      .pipe(catchError(this.handleError<Membre[]>('getFriends', [])));
  }

  addFriend(userId: number, friendId: number): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${userId}/friends`, { friendId })
      .pipe(catchError(this.handleError<any>('addFriend')));
  }

  removeFriend(userId: number, friendId: number): Observable<any> {
    return this.http
      .delete(`${this.apiUrl}/${userId}/friends/${friendId}`)
      .pipe(catchError(this.handleError<any>('removeFriend')));
  }

  recommendFriend(
    userId: number,
    friendId: number,
    recommenderId: number
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${userId}/recommend`, { friendId, recommenderId })
      .pipe(catchError(this.handleError<any>('recommendFriend')));
  }

  confirmFriendRequest(
    requesterId: number,
    receiverId: number
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${receiverId}/confirmFriend`, { requesterId })
      .pipe(catchError(this.handleError<any>('confirmFriendRequest')));
  }
  ignoreFriendRequest(
    requesterId: number,
    receiverId: number
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${receiverId}/ignoreFriend`, { requesterId })
      .pipe(catchError(this.handleError<any>('ignoreFriendRequest')));
  }
  ignoreRecommendation(userId: number, friendId: number): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${userId}/ignoreRecommendation`, { friendId })
      .pipe(catchError(this.handleError<any>('ignoreRecommendation')));
  }

  sendRecommendationEmail(
    receiverEmail: string,
    recommenderName: string,
    friendName: string
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/sendRecommendationEmail`, {
        receiverEmail,
        recommenderName,
        friendName,
      })
      .pipe(catchError(this.handleError<any>('sendRecommendationEmail')));
  }

  searchMembers(query: string): Observable<Membre[]> {
    return this.http
      .get<Membre[]>(`${this.apiUrl}?q=${query}`)
      .pipe(catchError(this.handleError<Membre[]>('searchMembers', [])));
  }

  sendFriendRequest(requesterId: number, friendId: number): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/${requesterId}/friendRequests`, {
        friendId,
        requesterStatus: 'invitation en cours',
        receiverStatus: 'en attente de confirmation',
      })
      .pipe(catchError(this.handleError<any>('sendFriendRequest')));
  }
  sendNotificationEmail(
    receiverEmail: string,
    requesterName: string
  ): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/sendNotificationEmail`, {
        receiverEmail,
        requesterName,
      })
      .pipe(catchError(this.handleError<any>('sendNotificationEmail')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
