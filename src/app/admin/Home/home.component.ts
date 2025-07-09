import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { RevenueChartComponent } from '../revenue-chart/revenue-chart.component';
import { environment } from '../../../environments/environment';

interface DashboardStat {
  title: string;
  value: string | number;
  loading: boolean;
}

interface Order {
  id: number;
  customerOrderId: number;
  storeName: string;
  orderDate: string;
  subTotal: number;
  status: string;
  clientName: string;
  shippingAddress: string;
  orderItems: any[];
}

@Component({
  selector: 'admin-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DashboardCardComponent, RevenueChartComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class AdminHomeComponent implements OnInit {
  stats: DashboardStat[] = [
    { title: 'Total Clients', value: 0, loading: true },
    { title: 'Total Vendors', value: 0, loading: true },
    { title: 'Total Stores', value: 0, loading: true },
    { title: 'Total Orders', value: 0, loading: true },
    { title: 'Revenue', value: '$0', loading: true },
  ];

  loading = false;
  error = '';
  showRevenueChart = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    this.error = '';

    // Load all data in parallel
    Promise.all([
      this.loadClientsCount(),
      this.loadVendorsCount(),
      this.loadStoresCount(),
      this.loadOrdersCount(),
      this.loadRevenueData()
    ]).then(() => {
      this.loading = false;
      this.cdr.detectChanges();
    }).catch((error) => {
      this.error = 'Failed to load dashboard data';
      this.loading = false;
      this.cdr.detectChanges();
    });
  }

  private async loadClientsCount(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const response = await this.http.get<any>('https://cloudmall.runasp.net/api/Auth/Admin/GetAllClientsByAdmin', { headers }).toPromise();
      
      if (response.success) {
        const clientsCount = response.data.length;
        const clientsValue = `${clientsCount}\n<small class="text-muted">Registered Clients</small>`;
        this.updateStat('Total Clients', clientsValue);
      } else {
        this.updateStat('Total Clients', 'Error');
      }
    } catch (error) {
      console.error('Error loading clients count:', error);
      this.updateStat('Total Clients', 'Error');
    }
  }

  private async loadVendorsCount(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const response = await this.http.get<any>(`${environment.apiBaseUrl}/Vendor/Admin/GetAllVendorsByAdmin`, { headers }).toPromise();
      
      if (response.success) {
        const vendorsCount = response.data.length;
        const vendorsValue = `${vendorsCount}\n<small class="text-muted">Registered Vendors</small>`;
        this.updateStat('Total Vendors', vendorsValue);
      } else {
        this.updateStat('Total Vendors', 'Error');
      }
    } catch (error) {
      console.error('Error loading vendors count:', error);
      this.updateStat('Total Vendors', 'Error');
    }
  }

  private async loadStoresCount(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const response = await this.http.get<any>(`${environment.apiBaseUrl}/Store/Admin/GetAllStores?pageNumber=1&pageSize=1000`, { headers }).toPromise();
      
      if (response && response.allStores) {
        const stores = response.allStores;
        const totalStores = stores.length;
        const activeStores = stores.filter((store: any) => store.isActive && !store.isDeleted).length;
        const inactiveStores = stores.filter((store: any) => !store.isActive && !store.isDeleted).length;
        
        // Display total with breakdown
        const storesValue = `${totalStores}\n<small class="text-muted">Active: ${activeStores} | Inactive: ${inactiveStores}</small>`;
        this.updateStat('Total Stores', storesValue);
      } else {
        this.updateStat('Total Stores', 'Error');
      }
    } catch (error) {
      console.error('Error loading stores count:', error);
      this.updateStat('Total Stores', 'Error');
    }
  }

  private async loadOrdersCount(): Promise<void> {
    try {
      // Get all vendors and their orders to count total orders
      const vendors = await this.getAllVendors();
      let totalOrders = 0;
      
      for (const vendor of vendors) {
        const vendorOrders = await this.getVendorOrders(vendor.id);
        totalOrders += vendorOrders.length;
      }
      
      const ordersValue = `${totalOrders}\n<small class="text-muted">Total Orders</small>`;
      this.updateStat('Total Orders', ordersValue);
    } catch (error) {
      console.error('Error loading orders count:', error);
      this.updateStat('Total Orders', 'Error');
    }
  }

  private async loadRevenueData(): Promise<void> {
    try {
      // Get all vendors and their orders to calculate revenue
      const vendors = await this.getAllVendors();
      let totalRevenue = 0;
      
      for (const vendor of vendors) {
        const vendorOrders = await this.getVendorOrders(vendor.id);
        totalRevenue += vendorOrders.reduce((sum: number, order: Order) => sum + order.subTotal, 0);
      }
      
      const revenueValue = `$${totalRevenue.toLocaleString()}\n<small class="text-muted">Total Revenue</small>`;
      this.updateStat('Revenue', revenueValue);
    } catch (error) {
      console.error('Error loading revenue data:', error);
      this.updateStat('Revenue', 'Error');
    }
  }

  private async getAllVendors(): Promise<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const response = await this.http.get<any>(`${environment.apiBaseUrl}/Vendor/Admin/GetAllVendorsByAdmin`, { headers }).toPromise();
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error('Failed to fetch vendors');
    }
  }

  private async getVendorOrders(vendorId: string): Promise<Order[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const response = await this.http.get<any>(`${environment.apiBaseUrl}/Vendor/Admin/Vendors/${vendorId}/Orders`, { headers }).toPromise();
    
    if (response && response.success) {
      return response.data;
    } else {
      return [];
    }
  }

  private updateStat(title: string, value: string | number): void {
    const stat = this.stats.find(s => s.title === title);
    if (stat) {
      stat.value = value;
      stat.loading = false;
    }
  }

  refreshData() {
    this.loadDashboardData();
  }

  toggleRevenueChart() {
    this.showRevenueChart = !this.showRevenueChart;
  }
}
