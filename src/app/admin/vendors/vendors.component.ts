import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Vendor {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Address {
  streetAddress: string;
  notes: string;
  governingLocationName: string;
}

interface Store {
  id: number;
  name: string;
  description: string;
  logoURL: string;
  categoryName: string;
  addresses: Address[];
}

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {
  vendors: Vendor[] = [];
  loading = false;
  error = '';
  showStoresModal = false;
  selectedVendor: Vendor | null = null;
  vendorStores: Store[] = [];
  storesLoading = false;
  storesError = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    this.loading = true;
    this.error = '';

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any>(`${environment.apiBaseUrl}/Vendor/Admin/GetAllVendorsByAdmin`, { headers })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.vendors = response.data;
          } else {
            this.error = 'Failed to load vendors';
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading vendors:', err);
          this.error = 'Error loading vendors. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  viewVendorStores(vendor: Vendor): void {
    this.selectedVendor = vendor;
    this.showStoresModal = true;
    this.loadVendorStores(vendor.id);
  }

  loadVendorStores(vendorId: string): void {
    this.storesLoading = true;
    this.storesError = '';

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any>(`${environment.apiBaseUrl}/Vendor/admin/vendors/${vendorId}/stores`, { headers })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.vendorStores = response.data;
          } else {
            this.storesError = 'Failed to load stores';
          }
          this.storesLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading vendor stores:', err);
          this.storesError = 'Error loading stores. Please try again.';
          this.storesLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  closeStoresModal(): void {
    this.showStoresModal = false;
    this.selectedVendor = null;
    this.vendorStores = [];
    this.storesError = '';
  }

  viewStoreProducts(store: Store): void {
    // TODO: Implement view store products functionality
    console.log('View products for store:', store.name);
  }

  enableStore(store: Store): void {
    // TODO: Implement enable store functionality
    console.log('Enable store:', store.name);
  }

  getStoreImageUrl(logoURL: string): string {
    if (logoURL.startsWith('http')) {
      return logoURL;
    }
    return `${environment.imageBaseUrl}${logoURL}`;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
} 