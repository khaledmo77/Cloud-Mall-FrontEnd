import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterLink,
  RouterLinkActive,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  CartService,
  CartItem,
} from '../../../core/ClientCore/client-cart-api.service';
import {
  ClientOrdersApiService,
  Order,
  VendorOrder,
} from '../../../core/ClientCore/client-orders-api.service';
import { AuthService } from '../../../core/auth.service';
import {
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  Subject,
} from 'rxjs';
import { ProductApiService } from '../../../core/storeCore/product-api.service';
import { OrderEventsService } from '../../../core/order-events.service';
import { StoreInfoService } from '../../../core/storeCore/store-info.service';
import { environment } from '../../../../environments/environment';
import { ClientProductApiService } from '../../../core/ClientCore/client-product-api.service';
import {
  StoreProductSearchApiService,
  Product,
} from '../../../core/storeCore/store-product-search-api.service';
import { StoreProductCategoryApiService } from '../../../core/storeCore/store-product-category-api.service';
import { ClientStoreCategoriesApiService } from '../../../core/ClientCore/client-store-categories-api.service';

@Component({
  selector: 'app-StoreHeader',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './StoreHeader.component.html',
  styleUrl: './StoreHeader.component.scss',
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

  // Product details modal state
  showProductModal = false;
  selectedProduct: any = null;
  isProductLoading = false;
  errorMessage: string | null = null;

  // Search functionality
  searchQuery = '';
  searchResults: Product[] = [];
  isSearching = false;
  showSearchResults = false;
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  // Category functionality
  storeCategories: any[] = [];
  selectedCategoryId: number | null = null;
  isLoadingCategories = false;
  @Output() categorySelected = new EventEmitter<number | null>();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductApiService,
    private clientProductService: ClientProductApiService,
    private ordersService: ClientOrdersApiService,
    private cdr: ChangeDetectorRef,
    private orderEventsService: OrderEventsService,
    private storeInfoService: StoreInfoService,
    private searchService: StoreProductSearchApiService,
    private categoryService: StoreProductCategoryApiService,
    private clientCategoryService: ClientStoreCategoriesApiService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      this.totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
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

    // Initialize search functionality
    this.initializeSearch();

    // Add global click handler for orders dropdown
    document.addEventListener('click', this.onOrdersClickOutside.bind(this));

    // Subscribe to order events for real-time updates
    this.orderEventsSubscription =
      this.orderEventsService.orderEvents$.subscribe((event) => {
        if (
          event.type === 'order_placed' &&
          !this.isVendor &&
          this.isLoggedIn
        ) {
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

    // Load orders on component init if user is logged in and not vendor
    if (!this.isVendor && this.isLoggedIn) {
      this.loadOrders();
    }

    // Get store name and addresses from API
    this.route.params.subscribe((params) => {
      const storeId = params['storeId'];
      if (storeId) {
        // Load store categories
        this.loadStoreCategories(+storeId);
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
            },
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
            },
          });
        }
      }
    });
  }

  getStoreNameFromId(storeId: string): string {
    // This is a placeholder. In a real app, you'd fetch store details from an API
    // For now, we'll generate a name based on the store ID
    const storeNames = [
      'TechMart',
      'StyleHub',
      'HomeEssentials',
      'FashionForward',
      'DigitalWorld',
      'LifestyleStore',
      'PremiumGoods',
      'SmartShop',
      'TrendyStore',
      'QualityMart',
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
      return words
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase();
    }
  }

  getProductImageUrl(item: any): string {
    // Find the first available URL property from the item
    const url =
      item.imagesURL || item.imageUrl || item.imageURL || item.productImageUrl;

    // If no URL is found, return the default image
    if (!url) {
      return 'assets/images/default.jpg';
    }

    // If the URL is already absolute (e.g., "https://..."), return it directly
    if (url.startsWith('http')) {
      return url;
    }

    // For all other cases (relative paths), build the full URL.
    // This intelligently adds a "/" separator only if the path doesn't already have one.
    const separator = url.startsWith('/') ? '' : '/';
    return `${environment.imageBaseUrl}${separator}${url}`;
  }

  getLogoUrl(): string {
    if (!this.logoUrl) return '';
    if (this.logoUrl.startsWith('http')) return this.logoUrl;
    if (this.logoUrl.startsWith('/'))
      return environment.imageBaseUrl + this.logoUrl;
    return environment.imageBaseUrl + '/' + this.logoUrl;
  }

  onLogoError(event: any): void {
    // Hide the image and show the fallback text logo
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
    // The fallback div will show automatically due to *ngIf="!logoUrl"
    this.logoUrl = null;
    this.cdr.detectChanges();
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/default.jpg';
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.orderEventsSubscription) {
      this.orderEventsSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    // Remove global click handler
    document.removeEventListener('click', this.onOrdersClickOutside.bind(this));
  }

  // Search functionality methods
  private initializeSearch(): void {
    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        if (query.trim()) {
          this.performSearch(query);
        } else {
          this.clearSearch();
        }
      });
  }

  onSearchInput(event: any): void {
    const query = event.target.value;
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  private performSearch(query: string): void {
    this.isSearching = true;
    this.showSearchResults = true;
    this.cdr.detectChanges();

    // Get store ID from route params
    this.route.params.subscribe((params) => {
      const storeId = params['storeId'];
      if (storeId) {
        this.searchService
          .searchProducts(+storeId, {
            name: query,
            pageNumber: 1,
            pageSize: 10,
          })
          .subscribe({
            next: (response) => {
              this.isSearching = false;
              if (response.success && response.data) {
                this.searchResults = response.data.allProducts;
              } else {
                this.searchResults = [];
              }
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error('Search error:', error);
              this.isSearching = false;
              this.searchResults = [];
              this.cdr.detectChanges();
            },
          });
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
    this.cdr.detectChanges();
  }

  onSearchResultClick(product: Product): void {
    // Navigate to product details page
    console.log('Search result clicked:', product.id);

    // Get vendorId and storeId from current route or URL
    let vendorId = this.route.snapshot.params['vendorId'];
    let storeId = this.route.snapshot.params['storeId'];

    // If not found in current route, try to get from URL
    if (!vendorId || !storeId) {
      const currentUrl = this.router.url;
      console.log('Current URL for product navigation:', currentUrl);

      // Parse the URL to extract vendorId and storeId
      // Expected format: /vendor/{vendorId}/store/{storeId}/...
      const urlParts = currentUrl.split('/');
      const vendorIndex = urlParts.findIndex((part) => part === 'vendor');
      const storeIndex = urlParts.findIndex((part) => part === 'store');

      if (
        vendorIndex !== -1 &&
        storeIndex !== -1 &&
        vendorIndex + 1 < urlParts.length &&
        storeIndex + 1 < urlParts.length
      ) {
        vendorId = urlParts[vendorIndex + 1];
        storeId = urlParts[storeIndex + 1];
        console.log(
          'Extracted from URL - vendorId:',
          vendorId,
          'storeId:',
          storeId
        );
      }
    }

    if (vendorId && storeId) {
      this.router.navigate([
        `/vendor/${vendorId}/store/${storeId}/product/${product.id}`,
      ]);
    } else {
      console.error(
        'Could not determine vendorId or storeId for product navigation'
      );
    }

    this.clearSearch();
  }

  onSearchFocus(): void {
    if (this.searchQuery.trim()) {
      this.showSearchResults = true;
      this.cdr.detectChanges();
    }
  }

  onSearchBlur(): void {
    // Delay hiding results to allow for clicks
    setTimeout(() => {
      this.showSearchResults = false;
      this.cdr.detectChanges();
    }, 200);
  }

  addToCartFromModal(product: any) {
    if (this.isVendor) return;

    this.cartService.addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imagesURL,
    });

    // Show success message
    console.log(`✅ ${product.name} added to cart!`);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.cleanCart();
  }

  navigateToStoreHome() {
    // Get the current route parameters to construct the storehome URL
    this.route.params.subscribe((params) => {
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
    this.route.params.subscribe((params) => {
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
        const vendorIndex = urlParts.findIndex((part) => part === 'vendor');
        const storeIndex = urlParts.findIndex((part) => part === 'store');

        if (
          vendorIndex !== -1 &&
          storeIndex !== -1 &&
          vendorIndex + 1 < urlParts.length &&
          storeIndex + 1 < urlParts.length
        ) {
          vendorId = urlParts[vendorIndex + 1];
          storeId = urlParts[storeIndex + 1];
          console.log(
            'Extracted from URL - vendorId:',
            vendorId,
            'storeId:',
            storeId
          );
        }
      }

      if (vendorId && storeId) {
        // Generate orderId and checkoutId (in a real app, these would come from the backend)
        const orderId = this.generateOrderId();
        const checkoutId = this.generateCheckoutId();

        // Navigate to the parameterized checkout route with full path
        this.router.navigate([
          `/vendor/${vendorId}/store/${storeId}/orderid/${orderId}/checkout/${checkoutId}`,
        ]);
      } else {
        console.error(
          'Could not determine vendorId or storeId for checkout navigation'
        );
        // Fallback to simple checkout if no store context
        this.router.navigate(['/checkout']);
      }
    });
  }

  private generateOrderId(): string {
    // Generate a simple order ID (in a real app, this would come from the backend)
    return (
      'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
  }

  private generateCheckoutId(): string {
    // Generate a simple checkout ID (in a real app, this would come from the backend)
    return (
      'checkout_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    );
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
      },
    });
  }

  toggleOrdersHistory(): void {
    this.showOrdersHistory = !this.showOrdersHistory;
    if (this.showOrdersHistory && this.orders.length === 0) {
      this.loadOrders();
    }
  }

  onOrdersClickOutside(event: any): void {
    // Check if click is outside the orders dropdown
    const ordersElement = event.target.closest('.navbar-orders');
    if (!ordersElement && this.showOrdersHistory) {
      this.showOrdersHistory = false;
      this.cdr.detectChanges();
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
      minute: '2-digit',
    });
  }

  getTotalItems(order: Order): number {
    return order.vendorOrders.reduce((total, vendorOrder) => {
      return (
        total +
        vendorOrder.orderItems.reduce((sum, item) => sum + item.quantity, 0)
      );
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

  public openProductModal(productId: number) {
    console.log('openProductModal called with ID:', productId);

    // Prevent multiple modals from opening
    if (this.showProductModal) {
      console.log('Modal already open, ignoring call');
      return;
    }

    document.body.classList.add('modal-open');
    this.isProductLoading = true;
    this.showProductModal = true;
    this.selectedProduct = null;
    this.errorMessage = null;
    let loadingTimeout = setTimeout(() => {
      if (this.isProductLoading) {
        this.isProductLoading = false;
        this.errorMessage = 'Request timed out. Please try again.';
        this.cdr.detectChanges();
      }
    }, 5000);
    // Use the new public method to fetch product details
    this.clientProductService.getProductByIdPublic(productId).subscribe({
      next: (response: any) => {
        clearTimeout(loadingTimeout);
        if (response && response.data) {
          this.selectedProduct = response.data;
        } else if (response && typeof response === 'object' && response.id) {
          this.selectedProduct = response;
        } else if (Array.isArray(response) && response.length > 0) {
          this.selectedProduct = response[0];
        } else {
          this.selectedProduct = null;
        }
        this.isProductLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        clearTimeout(loadingTimeout);
        this.isProductLoading = false;
        this.selectedProduct = null;
        this.errorMessage = 'Failed to load product details.';
        this.cdr.detectChanges();
      },
    });
  }

  public closeProductModal() {
    document.body.classList.remove('modal-open');
    this.showProductModal = false;
    this.selectedProduct = null;
    this.isProductLoading = false;
  }

  addToCart(product: any) {
    if (this.isVendor) return;
    this.cartService.addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imagesURL,
    });
    // Optionally, show a toast or alert here if you want
    // Example: this.showSuccessToast(`${product.name} added to cart!`);
  }

  // Category methods
  loadStoreCategories(storeId: number) {
    this.isLoadingCategories = true;

    // Use different service based on user role
    const categoryObservable = this.isVendor
      ? this.categoryService.getProductCategories(storeId)
      : this.clientCategoryService.getStoreProductCategories(storeId);

    categoryObservable.subscribe({
      next: (categories: any) => {
        // Handle different response formats
        if (Array.isArray(categories)) {
          this.storeCategories = categories;
        } else if (
          categories &&
          typeof categories === 'object' &&
          'data' in categories &&
          Array.isArray(categories.data)
        ) {
          this.storeCategories = categories.data;
        } else if (
          categories &&
          typeof categories === 'object' &&
          'success' in categories &&
          'data' in categories &&
          Array.isArray(categories.data)
        ) {
          this.storeCategories = categories.data;
        } else {
          this.storeCategories = [];
        }
        this.isLoadingCategories = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading store categories:', err);
        this.storeCategories = [];
        this.isLoadingCategories = false;
        this.cdr.detectChanges();
      },
    });
  }

  onCategorySelect(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    // Emit event to parent component to filter trending products
    this.categorySelected.emit(categoryId);
    console.log('Category selected:', categoryId);
  }
}
