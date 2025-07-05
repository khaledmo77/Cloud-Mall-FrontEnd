import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HeroSlider } from '../../storeComponents/hero-slider/hero-slider';
import { ProductApiService } from '../../../core/storeCore/product-api.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth.service';
import { StoreProductCategoryApiService } from '../../../core/storeCore/store-product-category-api.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-Storehome',
  standalone: true,
  imports: [RouterLink, HeroSlider, CommonModule, FormsModule],
  templateUrl: './Storehome.component.html',
  styleUrls: ['./Storehome.component.scss']
})
export class Storehome {
    storeId: number = 0;
    products: any[] = [];
    isVendor = false;
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

     constructor( private route: ActivatedRoute, 
     private productService: ProductApiService,
     private auth: AuthService,
     private storeProductCategoryService: StoreProductCategoryApiService,
     
  ) {}

  ngOnInit(): void {
    this.isVendor = this.auth.getUserRole() === 'Vendor';
    this.route.paramMap.subscribe(params => {
      const id = params.get('storeId');
      if (id) {
        this.storeId = +id;
        this.loadProducts();
      }
    });
  }
   loadProducts(): void {
    this.productService.getProductsByStore(this.storeId).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.products = data;
        } else if (data && Array.isArray(data.products)) {
          this.products = data.products;
        } else {
          this.products = [];
        }
      },
      error: (err) => {
        console.error('Error loading store products:', err);
        this.products = [];
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
    if (!this.storeId) return;
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
    this.productService.addProduct(formData).subscribe({
      next: () => {
        this.successMessage = 'Product added successfully!';
        setTimeout(() => {
          this.successMessage = null;
          this.showAddProductModal = false;
        }, 2000);
        this.loadProducts();
      },
      error: (err) => {
        alert('Failed to add product: ' + err.message);
      }
    });
  }

  submitAddCategory() {
    if (!this.storeId) return;
    this.storeProductCategoryService.addProductCategory(this.storeId, {
      name: this.addCategoryData.name,
      description: this.addCategoryData.description
    }).subscribe({
      next: () => {
        this.successMessage = 'Category added successfully!';
        setTimeout(() => {
          this.successMessage = null;
          this.showAddCategoryModal = false;
        }, 2000);
      },
      error: (err) => {
        alert('Failed to add category: ' + err.message);
      }
    });
  }
}
