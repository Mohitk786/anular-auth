import { Component, signal } from '@angular/core';
import { User } from '../dashboard/dashboard';
import { ToastrService } from 'ngx-toastr';
import { UsersTable } from '../users-table/users-table';

interface RecycledUserResponse {
  success: boolean;
  data: User[];
  message: string;
}

@Component({
  selector: 'app-recycle',
  imports: [UsersTable],
  templateUrl: './recycle.html',
  styleUrl: './recycle.css',
})
export class Recycle {
  deletedUsers = signal<User[]>([]);

  constructor(private toaster: ToastrService) {}

  ngOnInit(): void {
    this.fetchTotalUsers();
  }

  async fetchTotalUsers() {
    try {
      const res = await fetch('http://localhost:5000/dashboard/users/deleted', {
        credentials: 'include',
      });
      const data = (await res.json()) as RecycledUserResponse;

      if (data?.success) {
        this.deletedUsers.set(data.data);
        console.log('Total users data:', data?.data);
      } else {
        this.toaster.error(data?.message || 'Failed to fetch users data');
      }
    } catch (error: any) {
      this.toaster.error(error?.response?.data?.message || 'An error occurred. Please try again.');
    }
  }
}
