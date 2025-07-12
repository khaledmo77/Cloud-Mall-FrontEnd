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

  getProductImageUrl(item: any): string {
    // Handle different possible image URL properties
    const url = item.imagesURL || item.imageUrl || item.imageURL || item.productImageUrl;
    
    console.log('getProductImageUrl - item:', item);
    console.log('getProductImageUrl - raw URL:', url);
    
    if (!url) {
      console.log('No image URL found for item:', item);
      return 'assets/images/products/product-1.jpg';
    }
    
    if (url.startsWith('http')) {
      console.log('getProductImageUrl - absolute URL:', url);
      return url;
    }
    
    // If it starts with '/', append to base URL
    if (url.startsWith('/')) {
      const fullUrl = environment.imageBaseUrl + url;
      console.log('getProductImageUrl - constructed URL:', fullUrl);
      return fullUrl;
    }
    
    // If it's a relative path without '/', append to base URL with '/'
    const fullUrl = environment.imageBaseUrl + '/' + url;
    console.log('getProductImageUrl - constructed URL (without slash):', fullUrl);
    return fullUrl;
  }

  onImgError(event: any): void {
    console.log('Image failed to load:', event.target.src);
    event.target.src = 'assets/images/products/product-1.jpg';
  }
  goBack(): void {
    this.router.navigate(['/admin/vendors']);
  }
} 