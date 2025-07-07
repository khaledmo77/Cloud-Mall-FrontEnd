import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, ActivatedRoute } from '@angular/router';
import { CartService, CartItem } from '../../../core/ClientCore/client-cart-api.service';
import { AuthService } from '../../../core/auth.service';
import { Observable, Subscription } from 'rxjs';
import { ProductApiService } from '../../../core/storeCore/product-api.service';

@Component({
  selector: 'app-StoreHeader',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './StoreHeader.component.html',
  styleUrl: './StoreHeader.component.scss'
})
export class StoreHeader implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalCount = 0;
  totalAmount = 0;
  total$!: Observable<number>;
  isVendor = false;
  isLoggedIn = false;
  userName = '';
  storeName = '';
  addresses: any[] = [];
  logoUrl: string | null = null;
  private cartSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      this.totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });
    
    // Initialize total$ observable
    this.total$ = this.cartService.total$;
    
    // Check if user is vendor
    this.isVendor = this.authService.getUserRole() === 'Vendor';
    
    // Check if user is logged in and get user info
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = localStorage.getItem('name') || '';
    }

    // Get store name and addresses from API
    this.route.params.subscribe(params => {
      const storeId = params['storeId'];
      if (storeId) {
        this.productService.getStoreDetails(storeId).subscribe({
          next: (res: any) => {
            if (res && res.data) {
              this.storeName = res.data.name;
              this.addresses = res.data.addresses || [];
              this.logoUrl = res.data.logoURL || null;
              this.cdr.detectChanges();
            }
          },
          error: (err: any) => {
            this.storeName = '';
            this.addresses = [];
            this.logoUrl = null;
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  getStoreNameFromId(storeId: string): string {
    // This is a placeholder. In a real app, you'd fetch store details from an API
    // For now, we'll generate a name based on the store ID
    const storeNames = [
      'TechMart', 'StyleHub', 'HomeEssentials', 'FashionForward', 'DigitalWorld',
      'LifestyleStore', 'PremiumGoods', 'SmartShop', 'TrendyStore', 'QualityMart'
    ];
    const index = parseInt(storeId) % storeNames.length;
    return storeNames[index] || 'Store';
  }

  generateStoreLogo(): string {
    if (!this.storeName) return 'STORE';
    
    // Create initials from store name
    const words = this.storeName.split(' ');
    if (words.length === 1) {
      return this.storeName.substring(0, 2).toUpperCase();
    } else {
      return words.map(word => word.charAt(0)).join('').toUpperCase();
    }
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.cleanCart();
  }

  navigateToStoreHome() {
    // Get the current route parameters to construct the storehome URL
    this.route.params.subscribe(params => {
      const vendorId = params['vendorId'];
      const storeId = params['storeId'];
      if (vendorId && storeId) {
        // Navigate to the storehome route within the current store context
        this.router.navigate([`/vendor/${vendorId}/store/${storeId}`]);
      } else {
        // Fallback to root if no store context
        this.router.navigate(['/']);
      }
    });
  }

  logout() {
    // Clear session
    this.authService.logout();
    // Clear cart
    this.cartService.cleanCart();
    // Navigate to landing page
    this.router.navigate(['/']);
  }
}
