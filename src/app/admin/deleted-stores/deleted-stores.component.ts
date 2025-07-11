import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminStoresApiService, Store, StoresResponse } from '../../adminCore/admin-stores-api.service';
import { StoreCategoryApiService } from '../../adminCore/store-category-api';

@Component({
  selector: 'app-deleted-stores',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './deleted-stores.component.html',
  styleUrls: ['./deleted-stores.component.scss']
})
export class DeletedStoresComponent implements OnInit {
  stores: Store[] = [];
  categories: any[] = [];
  filteredStores: Store[] = [];
  loading = false;
  error = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;
  
  // Filters
  selectedCategory = '';
  searchTerm = '';
  
  // Category filter dropdown
  showCategoryFilter = false;

  constructor(
    private storesApi: AdminStoresApiService,
    private categoryApi: StoreCategoryApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadDeletedStores();
  }

  loadCategories() {
    const token = localStorage.getItem('token') || '';
    
    this.categoryApi.getAllCategoriesByAdmin(token).subscribe({
      next: (data) => {
        this.categories = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadDeletedStores() {
    this.loading = true;
    this.error = '';
    
    // Load all stores and filter for deleted ones
    // We need to load a larger page size to account for filtering
    const loadPageSize = this.pageSize * 3; // Load more to account for filtering
    this.storesApi.getAllStores(1, loadPageSize, this.selectedCategory || undefined)
      .subscribe({
        next: (response: StoresResponse) => {
          // Filter only deleted stores
          this.stores = response.allStores.filter(store => store.isDeleted);
          this.filteredStores = [...this.stores];
          this.totalCount = this.stores.length;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          this.currentPage = 1; // Always start from page 1 since we're loading all at once
          this.loading = false;
          this.applySearchFilter();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error loading deleted stores:', err);
          this.error = 'Failed to load deleted stores. Please try again.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadDeletedStores();
  }

  onSearchChange() {
    this.currentPage = 1; // Reset to first page when searching
    this.applySearchFilter();
  }

  applySearchFilter() {
    let filtered = [...this.stores];
    
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = this.stores.filter(store => 
        store.name.toLowerCase().includes(searchLower) ||
        store.vendorName.toLowerCase().includes(searchLower) ||
        store.categoryName.toLowerCase().includes(searchLower)
      );
    }
    
    this.totalCount = filtered.length;
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    
    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredStores = filtered.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.applySearchFilter(); // Apply pagination to filtered results
  }

  getStatusBadgeClass(store: Store): string {
    return 'badge bg-danger';
  }

  getStatusText(store: Store): string {
    return 'Deleted';
  }

  toggleCategoryFilter() {
    this.showCategoryFilter = !this.showCategoryFilter;
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Make Math available in template
  Math = Math;

  getStoreImageUrl(logoURL: string): string {
    if (!logoURL) return 'assets/images/default-store.png';
    if (logoURL.startsWith('http')) return logoURL;
    return 'https://cloudmall.runasp.net' + logoURL;
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/default-store.png';
  }
} 