import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ClientGetAllStoresApiService, Store, StoreFilterParams } from '../../core/ClientCore/client-getallstores-api.service';
import { GetCategoryStoresApiService, StoreCategory } from '../../core/SiteCore/Get-CategoryStores-api.service';
import { GoverningLocationApiService, GoverningLocation } from '../../core/SiteCore/governing-location-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-list',
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './store-list.component.html',
  styleUrl: './store-list.component.scss'
})
export class StoreListComponent implements OnInit, OnDestroy {
  stores: Store[] = [];
  filteredStores: Store[] = [];
  storeCategories: StoreCategory[] = [];
  governingLocations: GoverningLocation[] = [];
  error = '';

  // Pagination
  pageNumber = 1;
  pageSize = 9;
  totalPages = 1;
  totalItems = 0;
  selectedCategoryId: number | null = null;
  selectedLocationId: number | null = null;
  selectedStreetAddress: string = '';
  isLoading = false;
  private fetchTimeout: any;

  constructor(
    private storeService: ClientGetAllStoresApiService,
    private categoryService: GetCategoryStoresApiService,
    private locationService: GoverningLocationApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadStoreCategories();
    this.loadGoverningLocations();
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
        console.log('Loaded categories:', categories);
        this.storeCategories = categories;
        // Don't set a default category - let user see all stores first
        this.selectedCategoryId = null;
        this.fetchStores();
      },
      error: (err) => {
        console.error('Error loading store categories:', err);
        this.isLoading = false;
        this.storeCategories = [];
        // If categories fail to load, try to load all stores
        this.selectedCategoryId = null;
        this.fetchStores();
      }
    });
  }

  loadGoverningLocations() {
    this.locationService.getGoverningLocations().subscribe({
      next: (locations) => {
        this.governingLocations = locations;
      },
      error: (err) => {
        console.error('Error loading governing locations:', err);
        this.governingLocations = [];
      }
    });
  }

  fetchStores() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    // Build filter parameters
    const params: StoreFilterParams = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };
    
    if (this.selectedCategoryId) {
      params.categoryId = this.selectedCategoryId;
    }
    
    if (this.selectedLocationId) {
      params.governingLocationId = this.selectedLocationId;
    }
    
    if (this.selectedStreetAddress) {
      params.streetAddress = this.selectedStreetAddress;
    }
    
    console.log('Fetching stores with params:', params);
    
    this.storeService.getStoresPaginated(params).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.isLoading = false;
        let items: Store[] = [];
        
        // Handle different response formats
        if (response && (response as any).success && (response as any).data) {
          // API returns {success: true, data: {...}}
          const data = (response as any).data;
          if (data.allStores && Array.isArray(data.allStores)) {
            items = data.allStores;
          } else if (Array.isArray(data)) {
            items = data;
          } else if (data.items && Array.isArray(data.items)) {
            items = data.items;
          }
          
          // Extract pagination info from data
          this.totalItems = data.totalCount || items.length;
          this.pageNumber = data.currentPage || 1;
          this.totalPages = data.totalNumberOfPages || 1;
        } else if (response && Array.isArray(response.allStores)) {
          items = response.allStores;
          this.totalItems = response.totalCount || items.length;
          this.pageNumber = response.currentPage || 1;
          this.totalPages = response.totalNumberOfPages || 1;
        } else if (Array.isArray(response)) {
          items = response;
          this.totalItems = items.length;
          this.pageNumber = 1;
          this.totalPages = 1;
        }
        
        console.log('Processed items:', items);
        console.log('Pagination info:', {
          totalItems: this.totalItems,
          pageNumber: this.pageNumber,
          totalPages: this.totalPages
        });
        
        this.stores = items;
        this.filteredStores = items;
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching stores:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url
        });
        this.isLoading = false;
        this.error = `Failed to load stores: ${err.status} ${err.statusText}`;
        this.stores = [];
        this.filteredStores = [];
        this.cdr.detectChanges();
      }
    });
  }

  filterStores(categoryId: number | null) {
    // Clear any existing timeout
    if (this.fetchTimeout) {
      clearTimeout(this.fetchTimeout);
    }
    
    this.selectedCategoryId = categoryId;
    
    // Add a small delay to prevent rapid successive calls
    this.fetchTimeout = setTimeout(() => {
      this.fetchStores();
    }, 100);
  }

  filterByLocation(locationId: number | null) {
    // Clear any existing timeout
    if (this.fetchTimeout) {
      clearTimeout(this.fetchTimeout);
    }
    
    this.selectedLocationId = locationId;
    
    // Add a small delay to prevent rapid successive calls
    this.fetchTimeout = setTimeout(() => {
      this.fetchStores();
    }, 100);
  }

  filterByAddress(address: string) {
    // Clear any existing timeout
    if (this.fetchTimeout) {
      clearTimeout(this.fetchTimeout);
    }
    
    this.selectedStreetAddress = address;
    
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
