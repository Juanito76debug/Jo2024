import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000');
  }

  

  getAllUsers(): Observable<any[]> {
    return new Observable<any[]>(observer => {
      this.socket.emit('requestAllUsers');
      this.socket.on('allUsers', (users: any[]) => {
        observer.next(users);
      });
    });
  }

  // Méthode pour supprimer un utilisateur
  deleteUser(userId: number): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.emit('deleteUser', userId);
      this.socket.on('userDeleted', (response: any) => {
        observer.next(response);
      });
    });
  }

  // Simule le suivi des utilisateurs connectés
  getConnectedUsersCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.socket.on('userCount', (count: number) => {
        observer.next(count);
      });
    });
}

getUserRole(): string {
  // Simule l'obtention du rôle de l'utilisateur (à remplacer par une vraie implémentation)
  return 'member'; // ou 'admin'
}
}

