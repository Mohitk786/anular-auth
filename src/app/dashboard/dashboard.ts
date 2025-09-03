import { Component, signal, computed } from '@angular/core';
import { UsersTable } from '../users-table/users-table';
import { ToastrService } from 'ngx-toastr';
import { UserChartComponents } from "../chart/chart";

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
  counts: number[];
  dates: string[];
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
  imports: [UsersTable, UserChartComponents],
})
export class Dashboard {
  usersData = signal<UsersData>({ registeredToday: [], allUsers: [], counts: [], dates: [] });

  allUsers = computed(() => this.usersData().allUsers);
  registeredToday = computed(() => this.usersData().registeredToday);
  last5Days = computed(() => this.usersData().dates);
  last5DaysData = computed(() => this.usersData().counts)


  constructor(private toaster: ToastrService) {}

  ngOnInit(): void {
    this.fetchTotalUsers();
  }



  async fetchTotalUsers() {
    try {
      const res = await fetch('http://localhost:5000/dashboard/users', { credentials: 'include' });
      const data = (await res.json()) as fetchUsersResponse;

      if (data?.success) {
        this.usersData.set(data.data);
      console.log('Total users data:', data?.data);

      } else {
        this.toaster.error(data?.message || 'Failed to fetch users data');
      }
    } catch (error: any) {
      this.toaster.error(error?.response?.data?.message || 'An error occurred. Please try again.');
    }
  }
}
