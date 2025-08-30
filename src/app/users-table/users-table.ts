import { Component, Input } from '@angular/core';
import { User } from '../dashboard/dashboard';

@Component({
  selector: 'app-users-table',
  imports: [],
  templateUrl: './users-table.html',
  styleUrl: './users-table.css'
})
export class UsersTable {
  @Input() users!: User[]
}
