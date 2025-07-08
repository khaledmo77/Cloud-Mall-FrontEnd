import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent {
  transactions = [
    { date: '2024-06-01', orderId: 'ORD-001', amount: 120.00 },
    { date: '2024-06-02', orderId: 'ORD-002', amount: 250.00 },
    { date: '2024-06-03', orderId: 'ORD-003', amount: 75.50 },
    { date: '2024-06-04', orderId: 'ORD-004', amount: 300.00 },
  ];
}
