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
    totalProducts: 45,
    totalOrders: 128,
    totalRevenue: 15420.50,
    pendingOrders: 12,
    lowStockProducts: 8,
    activeProducts: 37
  };

  recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: 299.99, status: 'Pending', date: '2024-01-15' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: 149.50, status: 'Delivered', date: '2024-01-14' },
    { id: '#ORD-003', customer: 'Mike Johnson', amount: 89.99, status: 'Processing', date: '2024-01-13' },
    { id: '#ORD-004', customer: 'Sarah Wilson', amount: 199.99, status: 'Pending', date: '2024-01-12' }
  ];

  lowStockProducts = [
    { id: 1, name: 'Wireless Headphones', stock: 3, threshold: 10 },
    { id: 2, name: 'Smart Watch', stock: 5, threshold: 15 },
    { id: 3, name: 'Bluetooth Speaker', stock: 2, threshold: 8 },
    { id: 4, name: 'Phone Case', stock: 7, threshold: 20 }
  ];

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
    productCategoryId: null
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
    // Get userId from localStorage
    this.userId = localStorage.getItem('userId');
    
    if (this.userId) {
      // Fetch vendor's stores to get the correct storeId
      this.vendorStoresService.getAllStores().subscribe({
        next: (stores: any[]) => {
          if (stores && stores.length > 0) {
            // Use the first store (or you could let user select which store to manage)
            this.storeId = stores[0].id;
            console.log('StoreSettings - Using storeId:', this.storeId);
          } else {
            console.error('No stores found for vendor:', this.userId);
            alert('No stores found. Please create a store first.');
          }
        },
        error: (err: any) => {
          console.error('Error fetching vendor stores:', err);
          alert('Error loading store information. Please try again.');
        }
      });
    } else {
      console.error('No userId found in localStorage');
      alert('User ID not found. Please log in again.');
    }
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
    console.log('Toggle product modal clicked, current state:', this.showAddProductModal);
    this.showAddProductModal = !this.showAddProductModal;
    console.log('New state:', this.showAddProductModal);
    this.cdr.detectChanges();
  }

  toggleAddCategoryModal() {
    console.log('Toggle category modal clicked, current state:', this.showAddCategoryModal);
    this.showAddCategoryModal = !this.showAddCategoryModal;
    console.log('New state:', this.showAddCategoryModal);
    this.cdr.detectChanges();
  }

  closeAddProductModal() {
    this.showAddProductModal = false;
    this.cdr.detectChanges();
  }

  closeAddCategoryModal() {
    this.showAddCategoryModal = false;
    this.cdr.detectChanges();
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
    if (this.addProductData.productCategoryId) {
      formData.append('ProductCategoryID', this.addProductData.productCategoryId);
    }
    // Log FormData for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key + ':', value);
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
          productCategoryId: null
        };
        // Manually trigger change detection
        this.cdr.detectChanges();
        // Optionally reload products here
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
        // Log full error details for debugging
        console.error('API Error:', err);
        if (err.error) {
          console.error('err.error:', err.error);
        }
        if (err.message) {
          console.error('err.message:', err.message);
        }
        if (err.error && err.error.errors) {
          console.error('err.error.errors:', err.error.errors);
          errorMessage += '\n' + JSON.stringify(err.error.errors);
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
    
    console.log('Adding category for store:', this.storeId);
    console.log('Category data:', {
      name: this.addCategoryData.name,
      description: this.addCategoryData.description
    });
    
    this.storeProductCategoryService.addProductCategory(this.storeId, {
      name: this.addCategoryData.name,
      description: this.addCategoryData.description
    }).subscribe({
      next: () => {
        this.showSuccessToast('✅ Category added successfully!');
        this.closeAddCategoryModal();
        // Reset form
        this.addCategoryData = { name: '', description: '' };
        // Manually trigger change detection
        this.cdr.detectChanges();
        // Optionally reload categories here
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
        
        // Log full error details for debugging
        console.error('Category API Error:', err);
        if (err.error) {
          console.error('err.error:', err.error);
        }
        if (err.message) {
          console.error('err.message:', err.message);
        }
        if (err.error && err.error.errors) {
          console.error('err.error.errors:', err.error.errors);
          errorMessage += '\n' + JSON.stringify(err.error.errors);
        }
        alert(errorMessage);
      }
    });
  }
}
