import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ClientGetAllStoresApiService, Store } from '../../core/ClientCore/client-getallstores-api.service';
import { GetCategoryStoresApiService, StoreCategory } from '../../core/SiteCore/Get-CategoryStores-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-list',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.scss'
})
export class StoreListComponent implements OnInit, OnDestroy {
  stores: Store[] = [];
  filteredStores: Store[] = [];
  storeCategories: StoreCategory[] = [];
  error = '';

  // Pagination
  pageNumber = 1;
  pageSize = 9;
  totalPages = 1;
  totalItems = 0;
  selectedCategory: string | null = null;
  isLoading = false;
  private fetchTimeout: any;

  constructor(
    private storeService: ClientGetAllStoresApiService,
    private categoryService: GetCategoryStoresApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadStoreCategories();
  }

  ngOnDestroy(): void {
    if (this.fetchTimeout) {
      clearTimeout(this.fetchTimeout);
    }
  }

  loadStoreCategories() {
    this.isLoading = true;
    this.categoryService.getStoreCategories().subscribe({
      next: (categories) => {
        this.storeCategories = categories;
        // Set default category to first category if available
        if (categories.length > 0) {
          this.selectedCategory = categories[0].name;
        }
        this.fetchStores();
      },
      error: (err) => {
        console.error('Error loading store categories:', err);
        this.isLoading = false;
        this.storeCategories = [];
        // If categories fail to load, try to load all stores
        this.selectedCategory = null;
        this.fetchStores();
      }
    });
  }

  fetchStores() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    // If no category is selected, try to get all stores
    const params: any = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };
    
    if (this.selectedCategory) {
      params.categoryName = this.selectedCategory;
    }
    
    this.storeService.getStoresPaginated(params).subscribe({
      next: (response) => {
        this.isLoading = false;
        let items: Store[] = [];
        if (response && Array.isArray(response.allStores)) {
          items = response.allStores;
        } else if (Array.isArray(response)) {
          items = response;
        }
        
        this.stores = items;
        this.filteredStores = items;
        this.totalItems = response.totalCount || items.length;
        this.pageNumber = response.currentPage || 1;
        this.totalPages = response.totalNumberOfPages || 1;
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching stores:', err);
        this.isLoading = false;
        this.error = 'Failed to load stores';
        this.stores = [];
        this.filteredStores = [];
        this.cdr.detectChanges();
      }
    });
  }

  filterStores(category: string | null) {
    // Clear any existing timeout
    if (this.fetchTimeout) {
      clearTimeout(this.fetchTimeout);
    }
    
    this.selectedCategory = category;
    
    // Add a small delay to prevent rapid successive calls
    this.fetchTimeout = setTimeout(() => {
      this.fetchStores();
    }, 100);
  }

  openVendorStore(store: Store) {
    // Navigate to vendor store route (same as vendor, but will use different API based on user role)
    const vendorId = (store as any).vendorId || (store as any).vendorID;
    const storeId = store.id;
    if (vendorId && storeId) {
      this.router.navigate([`/vendor/${vendorId}/store/${storeId}`]);
    } else {
      alert('vendorId or store id missing! Store object: ' + JSON.stringify(store));
    }
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.fetchStores();
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.fetchStores();
    }
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.fetchStores();
    }
  }

  firstPage() {
    this.pageNumber = 1;
    this.fetchStores();
  }

  lastPage() {
    this.pageNumber = this.totalPages;
    this.fetchStores();
  }

  getStoreImageUrl(logoURL?: string): string {
    if (!logoURL) return 'assets/images/placeholder.png';
    if (logoURL.startsWith('http')) return logoURL;
    return 'http://cloudmall.runasp.net/' + logoURL.replace(/^\//, '');
  }
}
