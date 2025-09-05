import { Component, signal } from '@angular/core';
import { AuthService } from '../services/auth';
import { User } from '../dashboard/dashboard';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { ConfirmModal } from '../confirm-modal/confirm-modal';


@Component({
  selector: 'app-header',
  imports: [RouterModule, MatIcon, ConfirmModal],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(public authService: AuthService) {}
  user: User | null = null;
  isLogoutModalVisible = signal<boolean>(false);

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  confirmLogout(): void {
    console.log('Logging out...');
    this.isLogoutModalVisible.set(false);
    this.authService.logout();
  }
  onCancel(): void {
    this.isLogoutModalVisible.set(false);
  }
}
