import { Component, OnInit } from '@angular/core';
import { UserService } from '../home/User.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: any;


  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    const userId = 1; // Remplace par l'ID de l'utilisateur actuel
    this.userService.getAllUsers().subscribe(users => {
      this.user = users.find(user => user.id === userId);
    });
  }
}


