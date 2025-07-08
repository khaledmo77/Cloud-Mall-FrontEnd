import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users = [
    { name: 'Alice Smith', email: 'alice@example.com', role: 'User' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
    { name: 'Carol Lee', email: 'carol@example.com', role: 'Admin' },
    { name: 'David Kim', email: 'david@example.com', role: 'User' },
  ];
}
