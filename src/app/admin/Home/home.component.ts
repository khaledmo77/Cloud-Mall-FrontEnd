import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';

@Component({
  selector: 'admin-home',
  standalone: true,
  imports: [CommonModule, DashboardCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class AdminHomeComponent {
  stats = [
    { title: 'Total Users', value: 0 },
    { title: 'Total Stores', value: 0 },
    { title: 'Total Orders', value: 0 },
    { title: 'Revenue', value: '$0' },
  ];
}
