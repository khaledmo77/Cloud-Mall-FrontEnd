import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientProductApiService } from '../../../core/ClientCore/client-product-api.service';
import { ProductApiService } from '../../../core/storeCore/product-api.service';
import { AuthService } from '../../../core/auth.service';
import { CartService } from '../../../core/ClientCore/client-cart-api.service';
import { environment } from '../../../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;
  isLoading = false;
  error: string | null = null;
  isVendor = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientProductService: ClientProductApiService,
    private productService: ProductApiService,
    private authService: AuthService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.isVendor = this.authService.getUserRole() === 'Vendor';
    this.loadProduct();
    
    // Subscribe to route parameter changes to reload product when navigating to different product
    this.route.params.subscribe(params => {
      const productId = params['productId'];
      if (productId && this.product?.id !== +productId) {
        console.log('Product ID changed, reloading product:', productId);
        this.loadProduct();
      }
    });
  }

  loadProduct(): void {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();

    const productId = this.route.snapshot.paramMap.get('productId');
    if (!productId) {
      this.error = 'Product ID not found';
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    const service = this.isVendor ? this.productService : this.clientProductService;
    
    service.getProductById(+productId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.data) {
          this.product = response.data;
        } else if (response && typeof response === 'object' && response.id) {
          this.product = response;
        } else if (Array.isArray(response) && response.length > 0) {
          this.product = response[0];
        } else {
          this.product = null;
          this.error = 'Product not found';
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.error = 'Failed to load product details';
        console.error('Error loading product:', err);
        this.cdr.detectChanges();
      }
    });
  }

  getProductImageUrl(product: any): string {
    const url = product.imagesURL || product.imageUrl || product.imageURL || product.productImageUrl;
    if (!url) return 'assets/images/default.jpg';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return environment.imageBaseUrl + url;
    return url;
  }

  onImgError(event: any): void {
    event.target.src = 'assets/images/default.jpg';
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  addToCart(product: any): void {
    if (this.isVendor) return;

    this.cartService.addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imagesURL
    });

    // Show success toast
    this.showSuccessToast(`✅ ${product.name} added to cart!`);
  }

  showSuccessToast(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-toast']
    });
  }

  showErrorToast(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-toast']
    });
  }
}
