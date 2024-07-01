import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  } 
  // Simule le comptage des messages
  getMessageCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.socket.on('messageCount', (count: number) => {
        observer.next(count);
      });
  })
}
}   
  
