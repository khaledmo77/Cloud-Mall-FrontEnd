import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Chart, ChartConfiguration, ChartData } from 'chart.js/auto';
import { RevenueExplanationModalComponent, RevenueExplanation } from './revenue-explanation-modal.component';

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

interface VendorOrdersResponse {
  success: boolean;
  data: Order[];
}

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RevenueExplanationModalComponent],
  templateUrl: './revenue-chart.component.html',
  styleUrls: ['./revenue-chart.component.scss']
})
export class RevenueChartComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('revenueChart', { static: false }) chartRef!: ElementRef<HTMLCanvasElement>;
  
  private chart: Chart | null = null;
  loading = false;
  error = '';
  
  // Revenue data
  totalRevenue = 0;
  commissionRevenue = 0;
  subscriptionRevenue = 0;
  upsellRevenue = 0;
  
  // Chart data
  monthlyRevenue: { month: string; revenue: number }[] = [];
  vendorRevenue: { vendor: string; revenue: number }[] = [];
  
  // Flag to track if view is initialized
  private viewInitialized = false;

  // Modal state
  showModal = false;
  selectedExplanation: RevenueExplanation | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRevenueData();
  }

  ngAfterViewInit() {
    this.viewInitialized = true;
    // Add a small delay to ensure DOM is fully rendered
    setTimeout(() => {
      // If data is already loaded, create the chart
      if (this.monthlyRevenue.length > 0) {
        this.createRevenueChart();
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  async loadRevenueData() {
    this.loading = true;
    this.error = '';

    try {
      // Get all vendors first
      const vendors = await this.getAllVendors();
      
      // Get orders for each vendor
      const allOrders: Order[] = [];
      for (const vendor of vendors) {
        const vendorOrders = await this.getVendorOrders(vendor.id);
        allOrders.push(...vendorOrders);
      }

      // Calculate revenue metrics
      this.calculateRevenueMetrics(allOrders);
      
      // Create chart only if view is initialized
      if (this.viewInitialized) {
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
          this.createRevenueChart();
        }, 100);
      }
      
      this.loading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading revenue data:', error);
      this.error = 'Failed to load revenue data';
      this.loading = false;
      this.cdr.detectChanges();
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

    const response = await this.http.get<VendorOrdersResponse>(`${environment.apiBaseUrl}/Vendor/Admin/Vendors/${vendorId}/Orders`, { headers }).toPromise();
    
    if (response && response.success) {
      return response.data;
    } else {
      return [];
    }
  }

  private calculateRevenueMetrics(orders: Order[]) {
    // Calculate total revenue from subtotals
    this.totalRevenue = orders.reduce((sum, order) => sum + order.subTotal, 0);
    
    // Calculate commission revenue (5% of total)
    this.commissionRevenue = this.totalRevenue * 0.05;
    
    // Estimate subscription revenue (assuming $50 per vendor per month)
    const uniqueVendors = new Set(orders.map(order => order.storeName)).size;
    this.subscriptionRevenue = uniqueVendors * 50;
    
    // Estimate upsell revenue ($10-20 per vendor)
    this.upsellRevenue = uniqueVendors * 15;
    
    // Group by month for chart
    this.groupByMonth(orders);
    
    // Group by vendor for chart
    this.groupByVendor(orders);
  }

  private groupByMonth(orders: Order[]) {
    const monthlyData: { [key: string]: number } = {};
    
    orders.forEach(order => {
      const date = new Date(order.orderDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += order.subTotal;
    });
    
    this.monthlyRevenue = Object.entries(monthlyData)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private groupByVendor(orders: Order[]) {
    const vendorData: { [key: string]: number } = {};
    
    orders.forEach(order => {
      if (!vendorData[order.storeName]) {
        vendorData[order.storeName] = 0;
      }
      vendorData[order.storeName] += order.subTotal;
    });
    
    this.vendorRevenue = Object.entries(vendorData)
      .map(([vendor, revenue]) => ({ vendor, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 vendors
  }

  private createRevenueChart() {
    // Check if chart element exists
    if (!this.chartRef || !this.chartRef.nativeElement) {
      console.warn('Chart canvas element not available');
      return;
    }

    // Destroy existing chart
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.warn('Could not get 2D context from canvas');
      return;
    }

    // Check if we have data to display
    if (this.monthlyRevenue.length === 0) {
      console.warn('No monthly revenue data to display');
      return;
    }

    const chartData: ChartData = {
      labels: this.monthlyRevenue.map(item => item.month),
      datasets: [
        {
          label: 'Monthly Revenue',
          data: this.monthlyRevenue.map(item => item.revenue),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          tension: 0.4
        }
      ]
    };

    const config: ChartConfiguration = {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Monthly Revenue Trend'
          },
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        }
      }
    };

    try {
      this.chart = new Chart(ctx, config);
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }

  showRevenueExplanation(revenueType: string) {
    const explanations = {
      'Total Revenue': {
        title: 'Total Revenue',
        description: 'The total gross revenue from all vendor sales on the platform',
        calculation: 'Sum of all order subtotals from all vendors',
        assumptions: [
          'Based on actual order data from vendor APIs',
          'Includes all completed orders regardless of status',
          'Represents gross merchandise value (GMV)'
        ],
        businessLogic: 'This represents the total economic activity on our platform. It\'s the foundation for calculating our commission revenue and understanding platform growth.'
      },
      'Commission Revenue': {
        title: 'Commission Revenue',
        description: 'Our primary revenue stream from taking a percentage of vendor sales',
        calculation: 'Total Revenue × 5% Commission Rate',
        assumptions: [
          '5% commission rate on all vendor sales',
          'Applied to both trial and paying vendors',
          'Standard SaaS marketplace model'
        ],
        businessLogic: 'Commission revenue is our core business model. We charge 5% on all sales, even during the 30-day free trial period. This ensures revenue from day one while vendors test our platform.'
      },
      'Subscription Revenue': {
        title: 'Subscription Revenue',
        description: 'Monthly recurring revenue from vendor subscription fees',
        calculation: 'Number of Paying Vendors × $50 Monthly Fee',
        assumptions: [
          '$50/month subscription fee per vendor',
          '25% trial-to-paid conversion rate',
          'Only applies to vendors after trial period'
        ],
        businessLogic: 'After the 30-day free trial, vendors pay a $50 monthly subscription fee. With an estimated 25% conversion rate, this creates predictable recurring revenue.'
      },
      'Upsell Revenue': {
        title: 'Upsell Revenue',
        description: 'Additional revenue from premium features and advertising',
        calculation: 'Number of Paying Vendors × $15 Average Upsell',
        assumptions: [
          '$10-20 per vendor for premium features',
          'Only available to paying subscribers',
          'Includes advertising, advanced analytics, etc.'
        ],
        businessLogic: 'Upsell revenue comes from premium features like advanced analytics, advertising placement, and enhanced store customization. This increases customer lifetime value.'
      }
    };

    this.selectedExplanation = explanations[revenueType as keyof typeof explanations];
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedExplanation = null;
  }

  refreshData() {
    this.loadRevenueData();
  }
} 