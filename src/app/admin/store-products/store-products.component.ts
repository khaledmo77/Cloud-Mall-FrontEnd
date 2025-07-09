import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  sku: string;
  price: number;
  discount: number | null;
  stock: number;
  imagesURL: string;
  storeID: number;
  storeName: string;
  productCategoryID: number;
  productCategoryName: string;
  averageRating: number;
  reviewCount: number;
}

@Component({
  selector: 'app-store-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-products.component.html',
  styleUrls: ['./store-products.component.scss']
})
export class StoreProductsComponent implements OnInit {
  storeId!: number;
  products: Product[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storeId = +params['storeId'];
      if (this.storeId) {
        this.fetchProducts();
      } else {
        this.error = 'Invalid store ID.';
      }
    });
  }

  fetchProducts(): void {
    this.loading = true;
    this.error = '';
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    this.http.get<any>(`${environment.apiBaseUrl}/Product/Admin/GetAllProductForStoreByAdmin/${this.storeId}`, { headers })
      .subscribe({
        next: (response) => {
          if (response && response.success && Array.isArray(response.data)) {
            this.products = response.data;
            this.error = '';
          } else if (response && response.success && response.data === null) {
            this.products = [];
            this.error = '';
          } else {
            this.products = [];
            this.error = 'Failed to load products.';
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.products = [];
          this.error = 'Error loading products. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    // Fallback: ensure loading is not stuck forever
    setTimeout(() => {
      if (this.loading) {
        this.loading = false;
        if (!this.error && this.products.length === 0) {
          this.error = 'Request timed out. Please try again.';
        }
        this.cdr.detectChanges();
      }
    }, 10000);
  }

  goBack(): void {
    this.router.navigate(['/admin/vendors']);
  }
} 