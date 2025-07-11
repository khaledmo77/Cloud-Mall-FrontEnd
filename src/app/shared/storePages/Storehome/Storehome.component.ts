import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeroSlider } from '../../storeComponents/hero-slider/hero-slider';
import { ProductApiService } from '../../../core/storeCore/product-api.service';
import { CommonModule } from '@angular/common';
import { GetProductsApiService } from '../../../core/storeCore/Get-Products-api.service';
import { AuthService } from '../../../core/auth.service';
import { StoreProductCategoryApiService } from '../../../core/storeCore/store-product-category-api.service';
import { ClientStoreCategoriesApiService } from '../../../core/ClientCore/client-store-categories-api.service';
import { ClientProductApiService } from '../../../core/ClientCore/client-product-api.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/ClientCore/client-cart-api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-Storehome',
  standalone: true,
  imports: [RouterLink, HeroSlider, CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './Storehome.component.html',
  styleUrls: ['./Storehome.component.scss']
})
export class Storehome {
    storeId: number = 0;
    products: any[] = [];
    isVendor = false;
    
    // Main page loader - shows when first accessing the store
    isPageLoading = true;
    
    // Products loading state
    isLoading = false;
    
    // Individual operation loaders
    isProductLoading = false;
    isAddingProduct = false;
    isAddingCategory = false;
    
    errorMessage: string | null = null;
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
    selectedProduct: any = null;
    showProductModal = false;

    // Category filtering
    selectedCategoryId: number | null = null;
    filteredProducts: any[] = [];

     constructor( 
     private route: ActivatedRoute, 
     private productService: ProductApiService,
     private clientProductService: ClientProductApiService,
     private auth: AuthService,
     private storeProductCategoryService: StoreProductCategoryApiService,
    private clientCategoryService: ClientStoreCategoriesApiService,
     private cdr: ChangeDetectorRef,
     private cartService : CartService,
     private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('Storehome ngOnInit');
    
    // Show main page loader immediately
    this.isPageLoading = true;
    
    // Check if this is a vendor route or client route
    const currentUrl = window.location.pathname;
    console.log('Current URL:', currentUrl);
    
    // Determine if this is a vendor route (contains /vendor/) or client route
    // For API calls, we use vendor service only if user role is Vendor, regardless of route path
    this.isVendor = this.auth.getUserRole() === 'Vendor';
    console.log('Is vendor route:', this.isVendor);
    console.log('User role:', this.auth.getUserRole());
    
    this.route.paramMap.subscribe(params => {
      const id = params.get('storeId');
      console.log('paramMap subscribe', { id });
      if (id) {
        this.storeId = +id;
        this.loadProducts();
      } else {
        // No store ID found, hide loader and show error
        this.isPageLoading = false;
        this.errorMessage = 'Store ID not found.';
        this.cdr.detectChanges();
      }
    });

    // Listen for category selection events from the header
    window.addEventListener('categorySelected', (event: any) => {
      const categoryId = event.detail.categoryId;
      this.onCategorySelected(categoryId);
    });
  }
  
   loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    console.log('isLoading set to true');
    
    // Use appropriate service based on route (vendor vs client)
    const service = this.isVendor ? this.productService : this.clientProductService;
    const apiType = this.isVendor ? 'vendor' : 'client';
    console.log('Loading products for store:', this.storeId, 'Route type:', apiType, 'Using service:', this.isVendor ? 'vendor' : 'client');
    
    service.getProductsByStore(this.storeId).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.isPageLoading = false; // Hide main page loader
        console.log('isLoading set to false (next)');
        console.log('Raw API response:', data);
        console.log('Response type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        console.log('Response keys:', data && typeof data === 'object' ? Object.keys(data) : 'N/A');
        
        // Handle different response formats
        if (Array.isArray(data)) {
          this.products = data;
          console.log('Using data as array, length:', data.length);
        } else if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
          this.products = (data as any).data;
          console.log('Using data.data as array, length:', (data as any).data.length);
        } else if (data && typeof data === 'object' && 'products' in data && Array.isArray((data as any).products)) {
          this.products = (data as any).products;
          console.log('Using data.products as array, length:', (data as any).products.length);
        } else if (data && typeof data === 'object' && 'allProducts' in data && Array.isArray((data as any).allProducts)) {
          this.products = (data as any).allProducts;
          console.log('Using data.allProducts as array, length:', (data as any).allProducts.length);
        } else {
          this.products = [];
          console.log('No valid array found in response, setting products to empty array');
        }
        
        console.log('Final processed products:', this.products);
        // Initialize filtered products with all products
        this.filteredProducts = [...this.products];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.isPageLoading = false; // Hide main page loader even on error
        console.log('isLoading set to false (error)');
        console.error('Error loading store products:', err);
        this.products = [];
        if (err.status === 403) {
          this.errorMessage = 'Access denied. You may not have permission to view these products.';
        } else if (err.status === 404) {
          this.errorMessage = 'Store or products not found.';
        } else if (err.status === 0) {
          this.errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          this.errorMessage = `Failed to load products (${err.status}). Please try again later.`;
        }
        this.cdr.detectChanges();
      }
    });
  }

  onProductImageChange(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      this.addProductData.image = file;
    }
  }

  submitAddProduct() {
    console.log('submitAddProduct method called!');
    console.log('Form data:', this.addProductData);
    console.log('Store ID:', this.storeId);
    console.log('Is vendor:', this.isVendor);
    
    // Check if form is valid
    const form = document.querySelector('#addProductForm') as HTMLFormElement;
    if (form) {
      console.log('Form validity:', form.checkValidity());
      console.log('Form elements:', form.elements);
    }
    
    if (!this.storeId) {
      this.showErrorToast('Store ID not available. Please wait for store information to load.');
      return;
    }
    
    // Only vendors can add products
    if (!this.isVendor) {
      this.showErrorToast('Only store owners can add products.');
      return;
    }
    
    // Validate required fields
    console.log('Validating form data...');
    console.log('Name:', this.addProductData.name);
    console.log('Description:', this.addProductData.description);
    console.log('Price:', this.addProductData.price);
    
    if (!this.addProductData.name || !this.addProductData.description || !this.addProductData.price) {
      console.log('Validation failed - missing required fields');
      this.showErrorToast('Please fill in all required fields (Name, Description, Price).');
      return;
    }
    
    console.log('Validation passed - proceeding with API call');
    
    this.isAddingProduct = true; // Show add product loader
    
    const formData = new FormData();
    formData.append('Name', this.addProductData.name);
    formData.append('Description', this.addProductData.description);
    formData.append('Brand', this.addProductData.brand);
    formData.append('SKU', this.addProductData.sku);
    formData.append('Price', this.addProductData.price);
    formData.append('Discount', this.addProductData.discount);
    formData.append('Stock', this.addProductData.stock);
    if (this.addProductData.image) {
      formData.append('Image', this.addProductData.image);
    }
    formData.append('StoreID', this.storeId.toString());
    if (this.addProductData.productCategoryId) {
      formData.append('ProductCategoryID', this.addProductData.productCategoryId);
    }
    
    console.log('Adding product for store:', this.storeId);
    console.log('Is vendor:', this.isVendor);
    console.log('User role:', this.auth.getUserRole());
    console.log('Token exists:', !!this.auth.getToken());
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key + ':', value);
    }
    
    this.productService.addProduct(formData, this.storeId).subscribe({
      next: (response) => {
        console.log('Product added successfully:', response);
        this.isAddingProduct = false; // Hide add product loader
        this.showSuccessToast('Product added successfully!');
        
        // Reset form data
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
        
        setTimeout(() => {
          this.showAddProductModal = false;
        }, 2000);
        this.loadProducts(); // Reload products
      },
      error: (err) => {
        this.isAddingProduct = false; // Hide add product loader
        console.error('Error adding product:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        console.error('Error body:', err.error);
        
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
        
        this.showErrorToast(errorMessage);
      }
    });
  }

  submitAddCategory() {
    console.log('submitAddCategory method called!');
    console.log('Category form data:', this.addCategoryData);
    console.log('Store ID:', this.storeId);
    console.log('Is vendor:', this.isVendor);
    
    // Check if form is valid
    const form = document.querySelector('#addCategoryForm') as HTMLFormElement;
    if (form) {
      console.log('Category form validity:', form.checkValidity());
      console.log('Category form elements:', form.elements);
    }
    
    if (!this.storeId) {
      this.showErrorToast('Store ID not available. Please wait for store information to load.');
      console.warn('No storeId, aborting');
      return;
    }
    // Only vendors can add categories
    if (!this.isVendor) {
      this.showErrorToast('Only store owners can add categories.');
      console.warn('Not a vendor, aborting');
      return;
    }
    // Validate required fields
    console.log('Validating category form data...');
    console.log('Category Name:', this.addCategoryData.name);
    console.log('Category Description:', this.addCategoryData.description);
    
    if (!this.addCategoryData.name || !this.addCategoryData.description) {
      console.log('Category validation failed - missing required fields');
      this.showErrorToast('Please fill in all required fields (Name, Description).');
      console.warn('Missing required fields', this.addCategoryData);
      return;
    }
    
    console.log('Category validation passed - proceeding with API call');
    this.isAddingCategory = true; // Show add category loader
    console.log('Calling addProductCategory API', this.storeId, this.addCategoryData);
    this.storeProductCategoryService.addProductCategory(this.storeId, {
      name: this.addCategoryData.name,
      description: this.addCategoryData.description
    }).subscribe({
      next: (response) => {
        console.log('API success:', response);
        this.isAddingCategory = false; // Hide add category loader
        this.showSuccessToast('Category added successfully!');
        // Reset form data
        this.addCategoryData = {
          name: '',
          description: ''
        };
        setTimeout(() => {
          this.showAddCategoryModal = false;
        }, 2000);
      },
      error: (err) => {
        this.isAddingCategory = false; // Hide add category loader
        console.error('API error:', err);
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
        this.showErrorToast(errorMessage);
      }
    });
  }

  getProductImageUrl(imagesURL: string): string {
    console.log('getProductImageUrl - input:', imagesURL);
    console.log('getProductImageUrl - type:', typeof imagesURL);
    
    if (!imagesURL) {
      console.log('getProductImageUrl - no URL, using placeholder');
      return 'assets/images/placeholder.png'; // fallback image
    }
    
    if (imagesURL.startsWith('http')) {
      console.log('getProductImageUrl - absolute URL:', imagesURL);
      return imagesURL;
    }
    
    const fullUrl = 'https://cloudmall.runasp.net/' + imagesURL.replace(/^\//, '');
    console.log('getProductImageUrl - constructed URL:', fullUrl);
    return fullUrl;
  }

  onImageLoad(imageUrl: string): void {
    console.log('Image loaded successfully:', imageUrl);
  }

  onImageError(imageUrl: string): void {
    console.log('Image failed to load:', imageUrl);
  }

  addToCart(product: any) {
    if (this.isVendor) return; // check

    this.cartService.addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imagesURL
    });

    // Show success toast instead of alert
    this.showSuccessToast(`✅ ${product.name} added to cart!`);
  }

  // Make sure this is public for template use
  public openProductModal(productId: number) {
    console.log('Opening product modal for ID:', productId);
    console.log('Is vendor:', this.isVendor);
    console.log('Using service:', this.isVendor ? 'vendor' : 'client');
    
    document.body.classList.add('modal-open');
    this.isProductLoading = true; // Show product details loader
    this.showProductModal = true;
    this.selectedProduct = null;
    
    // For clients, try to find the product from the existing products list first
    if (!this.isVendor && this.products && this.products.length > 0) {
      console.log('Client - Searching for product in existing products list');
      const foundProduct = this.products.find(product => product.id === productId);
      
      if (foundProduct) {
        console.log('Client - Found product in existing list:', foundProduct);
        this.selectedProduct = foundProduct;
        this.isProductLoading = false;
        this.cdr.detectChanges();
        return;
      } else {
        console.log('Client - Product not found in existing list, will try API call');
      }
    }
    
    // If not found in existing list or if vendor, make API call
    const service = this.isVendor ? this.productService : this.clientProductService;
    
    console.log('Calling getProductById with ID:', productId);
    service.getProductById(productId).subscribe({
      next: (data: any) => {
        console.log('Product details API response:', data);
        console.log('Response type:', typeof data);
        console.log('Response keys:', data && typeof data === 'object' ? Object.keys(data) : 'N/A');
        
        if (data && typeof data === 'object' && 'data' in data && data.data) {
          this.selectedProduct = data.data;
          console.log('Using data.data:', this.selectedProduct);
        } else {
          this.selectedProduct = data;
          console.log('Using data directly:', this.selectedProduct);
        }
        
        this.isProductLoading = false; // Hide product details loader
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error loading product details:', err);
        this.isProductLoading = false; // Hide product details loader
        this.selectedProduct = null;
        this.errorMessage = 'Failed to load product details.';
        this.cdr.detectChanges();
      }
    });
  }

  closeProductModal() {
    document.body.classList.remove('modal-open');
    this.showProductModal = false;
    this.selectedProduct = null;
    this.isProductLoading = false;
  }

  addToCartFromModal(product: any) {
    this.addToCart(product);
    this.showSuccessToast('Product added to cart!');
  }

  // Toast notification methods
  showSuccessToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-toast']
    });
  }

  showErrorToast(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-toast']
    });
  }

  // Category filtering methods
  onCategorySelected(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    this.filterProductsByCategory();
  }

  private filterProductsByCategory() {
    if (this.selectedCategoryId === null) {
      // Show all products
      this.filteredProducts = [...this.products];
    } else {
      // Filter products by category
      this.filteredProducts = this.products.filter(product => 
        product.productCategoryId === this.selectedCategoryId
      );
    }
    console.log('Filtered products:', this.filteredProducts);
    this.cdr.detectChanges();
  }

  // Get products for display (either filtered or all)
  getDisplayProducts(): any[] {
    return this.selectedCategoryId !== null ? this.filteredProducts : this.products;
  }

  testButtonClick() {
    console.log('Button clicked!');
    console.log('Current form data:', this.addProductData);
    console.log('Current category data:', this.addCategoryData);
    console.log('Store ID:', this.storeId);
    console.log('Is vendor:', this.isVendor);
    alert('Button clicked!');
  }
}
