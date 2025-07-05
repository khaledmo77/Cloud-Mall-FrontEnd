import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-StoreSettings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatListModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './StoreSettings.component.html',
  styleUrl: './StoreSettings.component.scss'
})
export class StoreSettingsComponent implements OnInit {
  selectedTab = 0;
  storeStats = {
    totalProducts: 45,
    totalOrders: 128,
    totalRevenue: 15420.50,
    pendingOrders: 12,
    lowStockProducts: 8,
    activeProducts: 37
  };

  recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: 299.99, status: 'Pending', date: '2024-01-15' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: 149.50, status: 'Delivered', date: '2024-01-14' },
    { id: '#ORD-003', customer: 'Mike Johnson', amount: 89.99, status: 'Processing', date: '2024-01-13' },
    { id: '#ORD-004', customer: 'Sarah Wilson', amount: 199.99, status: 'Pending', date: '2024-01-12' }
  ];

  lowStockProducts = [
    { id: 1, name: 'Wireless Headphones', stock: 3, threshold: 10 },
    { id: 2, name: 'Smart Watch', stock: 5, threshold: 15 },
    { id: 3, name: 'Bluetooth Speaker', stock: 2, threshold: 8 },
    { id: 4, name: 'Phone Case', stock: 7, threshold: 20 }
  ];

  storeSettings = {
    storeName: 'Tech Gadgets Store',
    description: 'Premium electronics and gadgets for modern lifestyle',
    email: 'contact@techgadgets.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Digital City, DC 12345',
    currency: 'USD',
    timezone: 'EST',
    autoAcceptOrders: true,
    emailNotifications: true,
    smsNotifications: false
  };

  constructor() {}

  ngOnInit(): void {}

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'warn';
      case 'processing': return 'accent';
      case 'delivered': return 'primary';
      default: return 'primary';
    }
  }

  getStockStatus(stock: number, threshold: number): string {
    if (stock <= threshold * 0.3) return 'critical';
    if (stock <= threshold * 0.6) return 'warning';
    return 'good';
  }

  getStockColor(stock: number, threshold: number): string {
    if (stock <= threshold * 0.3) return 'warn';
    if (stock <= threshold * 0.6) return 'accent';
    return 'primary';
  }
}
