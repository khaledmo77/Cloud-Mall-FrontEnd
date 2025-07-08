import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, ActivatedRoute } from '@angular/router';
import { CartService, CartItem } from '../../../core/ClientCore/client-cart-api.service';
import { ClientOrdersApiService, Order, VendorOrder } from '../../../core/ClientCore/client-orders-api.service';
import { AuthService } from '../../../core/auth.service';
import { Observable, Subscription } from 'rxjs';
import { ProductApiService } from '../../../core/storeCore/product-api.service';
import { OrderEventsService } from '../../../core/order-events.service';
import { StoreInfoService } from '../../../core/storeCore/store-info.service';

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
  private orderEventsSubscription!: Subscription;

  // Orders history properties
  orders: Order[] = [];
  isLoadingOrders = false;
  ordersError = '';
  showOrdersHistory = false;
  selectedOrder: Order | null = null;
  showOrderDetails = false;
  isRefreshingAfterOrder = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductApiService,
    private ordersService: ClientOrdersApiService,
    private cdr: ChangeDetectorRef,
    private orderEventsService: OrderEventsService,
    private storeInfoService: StoreInfoService // <-- Inject the new service
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

    // Subscribe to order events for real-time updates
    this.orderEventsSubscription = this.orderEventsService.orderEvents$.subscribe(event => {
      if (event.type === 'order_placed' && !this.isVendor && this.isLoggedIn) {
        console.log('Order placed event received, refreshing orders...');
        this.isRefreshingAfterOrder = true;
        this.cdr.detectChanges();
        
        // Refresh orders after a short delay to ensure server has processed the order
        setTimeout(() => {
          this.loadOrders();
          this.isRefreshingAfterOrder = false;
          this.cdr.detectChanges();
        }, 1000);
      }
    });

    // Get store name and addresses from API
    this.route.params.subscribe(params => {
      const storeId = params['storeId'];
      if (storeId) {
        if (this.isVendor) {
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
        } else {
          // Use StoreInfoService for clients
          this.storeInfoService.getStoreById(+storeId).subscribe({
            next: (store: any) => {
              this.storeName = store.name;
              this.addresses = store.addresses || [];
              this.logoUrl = store.logoURL || null;
              this.cdr.detectChanges();
            },
            error: (err: any) => {
              this.storeName = '';
              this.addresses = [];
              this.logoUrl = null;
              this.cdr.detectChanges();
            }
          });
        }
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
    if (this.orderEventsSubscription) {
      this.orderEventsSubscription.unsubscribe();
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

  navigateToCheckout() {
    // Get the current route parameters to construct the checkout URL
    this.route.params.subscribe(params => {
      let vendorId = params['vendorId'];
      let storeId = params['storeId'];
      
      // If not found in current route, try to get from parent route
      if (!vendorId || !storeId) {
        // Get the full URL and extract vendorId and storeId from the path
        const currentUrl = this.router.url;
        console.log('Current URL for checkout navigation:', currentUrl);
        
        // Parse the URL to extract vendorId and storeId
        // Expected format: /vendor/{vendorId}/store/{storeId}/...
        const urlParts = currentUrl.split('/');
        const vendorIndex = urlParts.findIndex(part => part === 'vendor');
        const storeIndex = urlParts.findIndex(part => part === 'store');
        
        if (vendorIndex !== -1 && storeIndex !== -1 && vendorIndex + 1 < urlParts.length && storeIndex + 1 < urlParts.length) {
          vendorId = urlParts[vendorIndex + 1];
          storeId = urlParts[storeIndex + 1];
          console.log('Extracted from URL - vendorId:', vendorId, 'storeId:', storeId);
        }
      }
      
      if (vendorId && storeId) {
        // Generate orderId and checkoutId (in a real app, these would come from the backend)
        const orderId = this.generateOrderId();
        const checkoutId = this.generateCheckoutId();
        
        // Navigate to the parameterized checkout route with full path
        this.router.navigate([`/vendor/${vendorId}/store/${storeId}/orderid/${orderId}/checkout/${checkoutId}`]);
      } else {
        console.error('Could not determine vendorId or storeId for checkout navigation');
        // Fallback to simple checkout if no store context
        this.router.navigate(['/checkout']);
      }
    });
  }

  private generateOrderId(): string {
    // Generate a simple order ID (in a real app, this would come from the backend)
    return 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateCheckoutId(): string {
    // Generate a simple checkout ID (in a real app, this would come from the backend)
    return 'checkout_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Orders history methods
  loadOrders(): void {
    if (this.isVendor || !this.isLoggedIn) return;
    
    this.isLoadingOrders = true;
    this.ordersError = '';
    
    this.ordersService.getOrders().subscribe({
      next: (response) => {
        this.orders = response.data.orders || [];
        this.isLoadingOrders = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
        this.ordersError = 'Failed to load orders. Please try again.';
        this.isLoadingOrders = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleOrdersHistory(): void {
    this.showOrdersHistory = !this.showOrdersHistory;
    if (this.showOrdersHistory && this.orders.length === 0) {
      this.loadOrders();
    }
  }

  showOrderDetailsModal(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  closeOrderDetailsModal(): void {
    this.selectedOrder = null;
    this.showOrderDetails = false;
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTotalItems(order: Order): number {
    return order.vendorOrders.reduce((total, vendorOrder) => {
      return total + vendorOrder.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    }, 0);
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
