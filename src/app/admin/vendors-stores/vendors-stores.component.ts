import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

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

interface Vendor {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

@Component({
  selector: 'app-vendors-stores',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './vendors-stores.component.html',
  styleUrls: ['./vendors-stores.component.scss']
})
export class VendorsStoresComponent implements OnInit {
  vendor: Vendor | null = null;
  vendorStores: Store[] = [];
  storesLoading = false;
  storesError = '';

  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const vendorId = params['vendorId'];
      if (vendorId) {
        this.loadVendorInfo(vendorId);
        this.loadVendorStores(vendorId);
      }
    });
  }

  loadVendorInfo(vendorId: string): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any>(`${environment.apiBaseUrl}/Vendor/Admin/GetAllVendorsByAdmin`, { headers })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.vendor = response.data.find((v: Vendor) => v.id === vendorId) || null;
          }
        },
        error: (err) => {
          console.error('Error loading vendor info:', err);
        }
      });
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

  goBack(): void {
    this.router.navigate(['/admin/vendors']);
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
} 