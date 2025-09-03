import { Component, Input, signal } from '@angular/core';
import { User } from '../dashboard/dashboard';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users-table',
  imports: [],
  templateUrl: './users-table.html',
  styleUrl: './users-table.css',
})
export class UsersTable {
  @Input() users!: User[];
 @Input() isDashboard = false;


  constructor(private toaster: ToastrService) {}
  isSubmitting = signal<boolean>(false);

  async removeUser(id: string | undefined) {
    if (!id) return;

    this.isSubmitting.set(true);
    try {
      const res = await fetch(`http://localhost:5000/dashboard/users/remove/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data?.success) {
        this.toaster.success(data?.message || 'Success');
        this.users = this.users.filter((user) => user._id !== id);
      }else{
        this.toaster.error(data?.message || 'Failed to move user to Recycle Bin');
      }
    } catch (error: any) {
      this.toaster.error(error?.response?.data?.message || 'An error occurred. Please try again.');
    }finally{
      this.isSubmitting.set(false);
    }
  }
}
