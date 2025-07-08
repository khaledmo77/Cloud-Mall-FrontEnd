import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  orders = [
    { id: 'ORD-001', customer: 'Alice Smith', store: 'Tech Store' },
    { id: 'ORD-002', customer: 'Bob Johnson', store: 'Fashion Hub' },
    { id: 'ORD-003', customer: 'Carol Lee', store: 'Book World' },
    { id: 'ORD-004', customer: 'David Kim', store: 'Gadget Zone' },
  ];
}
