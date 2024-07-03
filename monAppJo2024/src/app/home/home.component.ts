import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { MessageService } from './MessageService';
import { UserService } from './User.service';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from '../logout/logout.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LogoutComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})


export class HomeComponent implements OnInit {

  public isLoggedIn$: Observable<boolean> = of(false);
  public messageCount$: Observable<number>= of(0);
  public connectedUserCount$: Observable<number> =of (0);


  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private userService: UserService,
    
  ) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.messageCount$ = this.messageService.getMessageCount()
    this.connectedUserCount$ = this.userService.getConnectedUsersCount();

    this.isLoggedIn$.subscribe(isLoggedIn => {
      console.log('User is logged in:', isLoggedIn);
  });

}

isLoggedIn() {
  return this.authService.isLoggedIn();
}

  
  }






