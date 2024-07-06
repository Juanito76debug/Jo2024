import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Membre } from '../models/membre.model';

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
    return this.http.put<Membre>(`${this.apiUrl}/${user.id}`, user);
  }
}
