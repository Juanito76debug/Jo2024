import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import io from 'socket.io-client';

export type UserType = 'visitor' | 'member'| 'admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


private users = [
    { username: 'user1', password: 'pass1' },];

  private userType = new BehaviorSubject<UserType>('visitor');
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private socket;
 

  constructor() {
    this.socket = io('http://localhost:3000');
  }
  setUserType(type: UserType) {
    this.userType.next(type);
  }

  // Méthodes pour obtenir le type d'utilisateur
  getUserType(): UserType {
    return this.userType.value;
  }

  register(userData: any): void {
    // Ici, vous feriez une requête HTTP ou WebSocket pour enregistrer l'utilisateur
    // Pour l'exemple, nous allons simplement simuler une inscription réussie
    this.socket.emit('register', userData);
    this.socket.on('registerResponse', (response) => {
      if (response.success) {
        // Mettre à jour le type d'utilisateur et l'état de connexion
        this.setUserType('member');
        this.isLoggedInSubject.next(true);
      }
    });
  }


  // Simule la connexion d'un utilisateur
  login(username: string, password: string): Observable<any> {
    return new Observable<any>((observer) => {
      const user = this.users.find(u => u.username === username && u.password === password);
      this.socket.emit('login', { username, password });
      this.socket.on('loginResponse', (response) => {
        if (response.success && user) {
          this.setUserType('member');
          this.isLoggedInSubject.next(true);
          observer.next({ success: true, userType: 'member' });
        } else {
          observer.next({ success: false });
        }
        observer.complete();
      });
    });

    

    

    // return new Observable<boolean>(observer => {
    //   const user = this.users.find(u => u.username === username && u.password === password);
      // this.socket.emit('login', { username, password });
      // this.socket.on('loginResponse', (response) => {
      //   // Ici, vous feriez une requête HTTP ou WebSocket pour vérifier les identifiants
      //   // Pour l'exemple, nous allons simplement simuler une connexion réussie
      //   const isLoggedIn = !!user;
      //   this.isLoggedInSubject.next(isLoggedIn);
      //   observer.next(isLoggedIn);
      //   observer.complete();
    }
  

  // Simule la déconnexion d'un utilisateur
  logout(): void {
    this.isLoggedInSubject.next(false);
    this.socket.emit('logout');
  }



  // Observable pour suivre l'état de connexion
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  isVisitor(): boolean {
    return this.getUserType() === 'visitor';
  }

  isMember(): boolean {
    return this.getUserType() === 'member';
  }

  isAdmin(): boolean {
    return this.getUserType() === 'admin';
  } 
}