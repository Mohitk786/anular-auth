import { Component, signal, computed } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { UsersTable } from '../users-table/users-table';
import { ToastrService } from 'ngx-toastr';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UsersData {
  registeredToday: User[];
  allUsers: User[];
}

interface fetchUsersResponse {
  success: boolean;
  data: UsersData;
  message: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  imports: [Header, Footer, UsersTable],
})
export class Dashboard {
  usersData = signal<UsersData>({ registeredToday: [], allUsers: [] });

  allUsers = computed(() => this.usersData().allUsers);
  registeredToday = computed(() => this.usersData().registeredToday);

  constructor(private toaster: ToastrService) {}

  ngOnInit(): void {
    this.fetchTotalUsers();
  }

  async fetchTotalUsers() {
    try {
      const res = await fetch('http://localhost:5000/dashboard/users', { credentials: 'include' });
      const data = (await res.json()) as fetchUsersResponse;
      console.log('Total users data:', data);

      if (data?.success) {
        this.usersData.set(data.data);
      } else {
        this.toaster.error(data?.message || 'Failed to fetch users data');
      }
    } catch (error: any) {
      this.toaster.error(error?.response?.data?.message || 'An error occurred. Please try again.');
    }
  }
}
