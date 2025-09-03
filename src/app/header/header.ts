import { Component } from '@angular/core';
import { AuthService } from '../services/auth';
import { User } from '../dashboard/dashboard';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(public authService: AuthService) {}
  user: User | null = null;

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }
}
