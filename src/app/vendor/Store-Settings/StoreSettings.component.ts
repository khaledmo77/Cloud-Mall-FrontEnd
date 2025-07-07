import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductApiService } from '../../core/storeCore/product-api.service';
import { StoreProductCategoryApiService } from '../../core/storeCore/store-product-category-api.service';
import { VendorStoresApiService } from '../../core/VendorCore/vendor-stores-api.service';

@Component({
  selector: 'app-StoreSettings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatListModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './StoreSettings.component.html',
  styleUrl: './StoreSettings.component.scss'
})
export class StoreSettingsComponent implements OnInit {
  selectedTab = 0;
  storeId: number | null = null;
  userId: string | null = null;
  storeStats = {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    activeProducts: 0
  };

  recentOrders: any[] = [];
  selectedOrder: any = null;
  isEditingStatus = false;
  availableStatuses = ['Pending', 'Processing', 'Shipped', 'Fulfilled', 'Cancelled'];

  lowStockProducts: any[] = [];
  productCategories: any[] = [];
  vendorStores: any[] = [];
  selectedStore: any = null;
  isLoading = false;
  errorMessage: string | null = null;
  categoriesLoading = false;
  componentLoading = true;
  hasCategoriesComputed = false;

  storeSettings = {
    storeName: 'Tech Gadgets Store',
    description: 'Premium electronics and gadgets for modern lifestyle',
    email: 'contact@techgadgets.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Digital City, DC 12345',
    currency: 'USD',
    timezone: 'EST',
    autoAcceptOrders: true,
    emailNotifications: true,
    smsNotifications: false
  };

  showAddProductModal = false;
  showAddCategoryModal = false;
  addProductData: any = {
    name: '',
    description: '',
    brand: '',
    sku: '',
    price: null,
    discount: null,
    stock: null,
    image: null,
    selectedCategoryId: null
  };
  addCategoryData: any = {
    name: '',
    description: ''
  };
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductApiService,
    private storeProductCategoryService: StoreProductCategoryApiService,
    private vendorStoresService: VendorStoresApiService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadVendorStores();
  }

  private loadVendorStores() {
    this.isLoading = true;
    this.errorMessage = null;
    this.componentLoading = true;
    this.cdr.detectChanges();
    
    // First, get all vendor stores to determine which store to manage
      this.vendorStoresService.getAllStores().subscribe({
        next: (stores: any[]) => {
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        });
        
        if (stores.length === 0) {
          // No stores found - show message to create store first
          this.showSuccessToast('⚠️ You need to create a store first before managing store settings!');
          this.componentLoading = false;
          return;
        }
        
        if (stores.length === 1) {
          // Only one store - use that storeId
          this.storeId = stores[0].id;
          this.selectedStore = stores[0];
          this.vendorStores = stores;
          this.loadStoreData();
        } else {
          // Multiple stores - store all stores and use the first one
          this.vendorStores = stores;
          this.selectedStore = stores[0];
            this.storeId = stores[0].id;
          this.showSuccessToast(`Managing store: ${stores[0].name}. Use the store selector to switch between stores.`);
          this.loadStoreData();
        }
      },
      error: (err: any) => {
        setTimeout(() => {
          this.isLoading = false;
          this.componentLoading = false;
          this.cdr.detectChanges();
        });
        
        this.errorMessage = 'Failed to load your stores. Please try again.';
        this.showSuccessToast('❌ Failed to load your stores. Please try again.');
      }
    });
  }

  retryLoadStores() {
    this.loadVendorStores();
  }

  private loadStoreData() {
    if (!this.storeId) {
      return;
    }

    // Fetch recent orders for this specific store
              this.vendorStoresService.getStoreOrders(this.storeId).subscribe({
                next: (res: any) => {
                  if (res && res.success && res.data && Array.isArray(res.data.orders)) {
                    this.recentOrders = res.data.orders;
                    this.storeStats.totalOrders = res.data.totalOrders || this.recentOrders.length;
                    this.storeStats.pendingOrders = this.recentOrders.filter(order => (order.status || '').toLowerCase() === 'pending').length;
                    this.storeStats.totalRevenue = this.recentOrders
                      .filter(order => (order.status || '').toLowerCase() === 'fulfilled')
                      .reduce((sum, order) => sum + (order.subTotal || 0), 0);
                  } else {
                    this.recentOrders = [];
                    this.storeStats.totalOrders = 0;
                    this.storeStats.pendingOrders = 0;
                    this.storeStats.totalRevenue = 0;
                  }
        setTimeout(() => {
                  this.cdr.detectChanges();
        });
                },
                error: (err: any) => {
                  this.recentOrders = [];
                  this.storeStats.totalOrders = 0;
                  this.storeStats.pendingOrders = 0;
                  this.storeStats.totalRevenue = 0;
        setTimeout(() => {
                  this.cdr.detectChanges();
        });
                }
              });
    
              // Fetch all products for this store and set totalProducts
              this.productService.getProductsByStore(this.storeId).subscribe({
                next: (products: any[]) => {
                  this.storeStats.totalProducts = products.length;
        
        // Calculate low stock products (stock <= 5 or stock <= threshold if available)
        this.storeStats.lowStockProducts = products.filter(product => {
          const stock = product.stock || 0;
          const threshold = product.stockThreshold || 5; // Default threshold of 5
          return stock <= threshold;
        }).length;
        
        // Calculate active products (products with stock > 0)
        this.storeStats.activeProducts = products.filter(product => {
          const stock = product.stock || 0;
          return stock > 0;
        }).length;
        
        this.lowStockProducts = products.filter(product => {
          const stock = product.stock || 0;
          const threshold = product.stockThreshold || 5; // Default threshold of 5
          return stock <= threshold;
        });
        
        setTimeout(() => {
                  this.cdr.detectChanges();
        });
                },
                error: (err: any) => {
                  this.storeStats.totalProducts = 0;
        this.storeStats.lowStockProducts = 0;
        this.storeStats.activeProducts = 0;
        setTimeout(() => {
                  this.cdr.detectChanges();
        });
      }
    });

    // Fetch product categories for this store
    this.categoriesLoading = true;
    this.storeProductCategoryService.getProductCategories(this.storeId).subscribe({
      next: (categories: any) => {
        // Handle different response formats
        if (Array.isArray(categories)) {
          this.productCategories = categories;
        } else if (categories && typeof categories === 'object' && 'data' in categories && Array.isArray(categories.data)) {
          this.productCategories = categories.data;
        } else if (categories && typeof categories === 'object' && 'success' in categories && 'data' in categories && Array.isArray(categories.data)) {
          this.productCategories = categories.data;
          } else {
          this.productCategories = [];
        }
        
        this.categoriesLoading = false;
        this.hasCategoriesComputed = this.productCategories.length > 0;
        this.componentLoading = false;
        
        setTimeout(() => {
          this.cdr.detectChanges();
        });
        },
        error: (err: any) => {
        this.productCategories = [];
        this.categoriesLoading = false;
        this.hasCategoriesComputed = false;
        this.componentLoading = false;
        setTimeout(() => {
          this.cdr.detectChanges();
        });
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'warn';
      case 'processing': return 'accent';
      case 'delivered': return 'primary';
      default: return 'primary';
    }
  }

  getStockStatus(stock: number, threshold: number): string {
    if (stock <= threshold * 0.3) return 'critical';
    if (stock <= threshold * 0.6) return 'warning';
    return 'good';
  }

  getStockColor(stock: number, threshold: number): string {
    if (stock <= threshold * 0.3) return 'warn';
    if (stock <= threshold * 0.6) return 'accent';
    return 'primary';
  }

  onProductImageChange(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      this.addProductData.image = file;
    }
  }

  showSuccessToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-toast']
    });
  }

  toggleAddProductModal() {
    // Check if categories are still loading
    if (this.categoriesLoading) {
      this.showSuccessToast('⏳ Please wait while categories are loading...');
      return;
    }
    
    // Check if categories exist before allowing to add product
    if (this.productCategories.length === 0) {
      this.showSuccessToast('⚠️ You should add product categories for your store first!');
      return;
    }
    
    this.showAddProductModal = !this.showAddProductModal;
    setTimeout(() => {
    this.cdr.detectChanges();
    });
  }

  toggleAddCategoryModal() {
    this.showAddCategoryModal = !this.showAddCategoryModal;
    setTimeout(() => {
    this.cdr.detectChanges();
    });
  }

  closeAddProductModal() {
    this.showAddProductModal = false;
    setTimeout(() => {
    this.cdr.detectChanges();
    });
  }

  closeAddCategoryModal() {
    this.showAddCategoryModal = false;
    setTimeout(() => {
    this.cdr.detectChanges();
    });
  }

  submitAddProduct() {
    if (!this.storeId) {
      alert('Store ID not available. Please wait for store information to load.');
      return;
    }
    const formData = new FormData();
    formData.append('Name', this.addProductData.name);
    formData.append('Description', this.addProductData.description);
    formData.append('Brand', this.addProductData.brand);
    formData.append('SKU', this.addProductData.sku);
    if (this.addProductData.price != null && this.addProductData.price !== '') formData.append('Price', String(this.addProductData.price));
    if (this.addProductData.discount != null && this.addProductData.discount !== '') formData.append('Discount', String(this.addProductData.discount));
    if (this.addProductData.stock != null && this.addProductData.stock !== '') formData.append('Stock', String(this.addProductData.stock));
    if (this.addProductData.image) {
      formData.append('Image', this.addProductData.image);
    }
    formData.append('StoreID', this.storeId.toString());
    if (this.addProductData.selectedCategoryId) {
      formData.append('ProductCategoryID', this.addProductData.selectedCategoryId);
    }
    this.productService.addProduct(formData, this.storeId).subscribe({
      next: () => {
        this.showSuccessToast('✅ Product added successfully!');
        this.closeAddProductModal();
        // Reset form
        this.addProductData = {
          name: '',
          description: '',
          brand: '',
          sku: '',
          price: null,
          discount: null,
          stock: null,
          image: null,
          selectedCategoryId: null
        };
        // Manually trigger change detection
        setTimeout(() => {
        this.cdr.detectChanges();
        });
        // Optionally reload products here - defer to next cycle
        setTimeout(() => {
          this.refreshProducts();
        });
      },
      error: (err) => {
        let errorMessage = 'Failed to add product';
        if (err.status === 400) {
          errorMessage = 'Invalid product data. Please check all required fields.';
        } else if (err.status === 401) {
          errorMessage = 'Unauthorized. Please log in again.';
        } else if (err.status === 403) {
          errorMessage = 'Access denied. You may not have permission to add products to this store.';
        } else if (err.status === 0) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }
        alert(errorMessage);
      }
    });
  }

  submitAddCategory() {
    if (!this.storeId) {
      alert('Store ID not available. Please wait for store information to load.');
      return;
    }
    
    this.storeProductCategoryService.addProductCategory(this.storeId, {
      name: this.addCategoryData.name,
      description: this.addCategoryData.description
    }).subscribe({
      next: () => {
        this.showSuccessToast('✅ Category added successfully!');
        this.closeAddCategoryModal();
        // Reset form
        this.addCategoryData = { name: '', description: '' };
        
        // Refresh categories list - defer to next cycle
        setTimeout(() => {
          this.refreshCategories();
        });
        
        // Manually trigger change detection
        setTimeout(() => {
        this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        let errorMessage = 'Failed to add category';
        if (err.status === 400) {
          errorMessage = 'Invalid category data. Please check all required fields.';
        } else if (err.status === 401) {
          errorMessage = 'Unauthorized. Please log in again.';
        } else if (err.status === 403) {
          errorMessage = 'Access denied. You may not have permission to add categories to this store.';
        } else if (err.status === 0) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (err.error && err.error.message) {
          errorMessage = err.error.message;
        }
        
        alert(errorMessage);
      }
    });
  }

  openOrderDetails(order: any) {
    this.selectedOrder = order;
    this.isEditingStatus = false;
  }

  closeOrderDetails() {
    this.selectedOrder = null;
    this.isEditingStatus = false;
  }

  toggleStatusEdit() {
    this.isEditingStatus = !this.isEditingStatus;
  }

  // Helper to ensure status is capitalized as expected by backend
  private formatStatus(status: string): string {
    // Map of allowed statuses (add more as needed)
    const allowed = ['Pending', 'Processing', 'Shipped', 'Fulfilled', 'Cancelled'];
    const found = allowed.find(s => s.toLowerCase() === status.toLowerCase());
    return found || status;
  }

  // Helper to recalculate store stats from recentOrders
  private updateStoreStatsFromOrders(orders: any[], totalOrdersFromApi?: number) {
    setTimeout(() => {
    this.storeStats.totalOrders = totalOrdersFromApi || orders.length;
    this.storeStats.pendingOrders = orders.filter(order => (order.status || '').toLowerCase() === 'pending').length;
    this.storeStats.totalRevenue = orders
      .filter(order => (order.status || '').toLowerCase() === 'fulfilled')
      .reduce((sum, order) => sum + (order.subTotal || 0), 0);
    this.cdr.detectChanges();
    });
  }

  updateOrderStatus(newStatus: string) {
    if (this.selectedOrder && this.selectedOrder.id) {
      const formattedStatus = this.formatStatus(newStatus);
      this.vendorStoresService.updateOrderStatus(this.selectedOrder.id, formattedStatus).subscribe({
        next: (response) => {
          // Reload orders from backend for full sync
          this.vendorStoresService.getStoreOrders(this.storeId!).subscribe({
            next: (res: any) => {
              setTimeout(() => {
              if (res && res.success && res.data && Array.isArray(res.data.orders)) {
                this.recentOrders = res.data.orders;
                this.updateStoreStatsFromOrders(this.recentOrders, res.data.totalOrders);
              }
              this.selectedOrder = this.recentOrders.find(order => order.id === this.selectedOrder.id) || null;
              this.isEditingStatus = false;
              this.showSuccessToast('Order status updated successfully');
              this.cdr.detectChanges();
              });
            },
            error: (err) => {
              setTimeout(() => {
              this.showSuccessToast('Order status updated, but failed to reload orders');
              this.isEditingStatus = false;
                this.cdr.detectChanges();
              });
            }
          });
        },
        error: (error) => {
          setTimeout(() => {
          this.showSuccessToast('Failed to update order status');
            this.cdr.detectChanges();
          });
        }
      });
    }
  }

  getOrderStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning';
      case 'Processing': return 'bg-info';
      case 'Fulfilled':
      case 'Delivered': return 'bg-success';
      case 'Cancelled':
      case 'Rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  // Helper to check if categories exist
  hasCategories(): boolean {
    return this.hasCategoriesComputed;
  }

  // Method to handle store selection
  selectStore(store: any) {
    this.selectedStore = store;
    this.storeId = store.id;
    this.componentLoading = true;
    setTimeout(() => {
      this.cdr.detectChanges();
      this.loadStoreData();
    });
  }

  // Helper to refresh categories list
  private refreshCategories() {
    if (this.storeId) {
      this.categoriesLoading = true;
      this.storeProductCategoryService.getProductCategories(this.storeId).subscribe({
        next: (categories: any) => {
          setTimeout(() => {
            // Handle different response formats
            if (Array.isArray(categories)) {
              this.productCategories = categories;
            } else if (categories && typeof categories === 'object' && 'data' in categories && Array.isArray(categories.data)) {
              this.productCategories = categories.data;
            } else if (categories && typeof categories === 'object' && 'success' in categories && 'data' in categories && Array.isArray(categories.data)) {
              this.productCategories = categories.data;
            } else {
              this.productCategories = [];
            }
            
            this.categoriesLoading = false;
            this.hasCategoriesComputed = this.productCategories.length > 0;
            this.cdr.detectChanges();
          });
        },
        error: (err: any) => {
          setTimeout(() => {
            this.categoriesLoading = false;
            this.hasCategoriesComputed = false;
            this.cdr.detectChanges();
          });
        }
      });
    }
  }

  // Helper to refresh products list
  private refreshProducts() {
    if (this.storeId) {
      this.productService.getProductsByStore(this.storeId).subscribe({
        next: (products: any[]) => {
          setTimeout(() => {
            this.storeStats.totalProducts = products.length;
            
            // Calculate low stock products (stock <= 5 or stock <= threshold if available)
            this.storeStats.lowStockProducts = products.filter(product => {
              const stock = product.stock || 0;
              const threshold = product.stockThreshold || 5; // Default threshold of 5
              return stock <= threshold;
            }).length;
            
            // Calculate active products (products with stock > 0)
            this.storeStats.activeProducts = products.filter(product => {
              const stock = product.stock || 0;
              return stock > 0;
            }).length;
            
            this.lowStockProducts = products.filter(product => {
              const stock = product.stock || 0;
              const threshold = product.stockThreshold || 5; // Default threshold of 5
              return stock <= threshold;
            });
            
            this.cdr.detectChanges();
          });
        },
        error: (err: any) => {
          setTimeout(() => {
            this.storeStats.totalProducts = 0;
            this.storeStats.lowStockProducts = 0;
            this.storeStats.activeProducts = 0;
            this.cdr.detectChanges();
          });
        }
      });
    }
  }
}
