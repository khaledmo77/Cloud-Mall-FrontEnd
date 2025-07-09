import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminStoresApiService, Store, StoresResponse } from '../../adminCore/admin-stores-api.service';
import { StoreCategoryApiService } from '../../adminCore/store-category-api';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {
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
  // Status filter
  showStatusFilter = false;
  selectedStatusFilter = '';
  statusLoadingId: number | null = null;
  
  // Category filter dropdown
  showCategoryFilter = false;

  // Delete confirmation modal
  storeToDelete: Store | null = null;
  deleting = false;

  constructor(
    private storesApi: AdminStoresApiService,
    private categoryApi: StoreCategoryApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadStores();
  }

  loadCategories() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTdXBlcmFkbWluQGdtYWlsLmNvbSIsImp0aSI6ImU1OWYxMDM5LTdmMzgtNGFmZi1hYTk3LWRkNjViYzllOTNkYSIsImVtYWlsIjoiU3VwZXJhZG1pbkBnbWFpbC5jb20iLCJpZCI6IjJiZjgxZDhhLWU0NmQtNGYxOS1hMDAzLTI1OTQ1ODI2OWFhMyIsInJvbGUiOiJTdXBlckFkbWluIiwibmJmIjoxNzUyMDU3MjAzLCJleHAiOjE3NTIwOTMyMDMsImlhdCI6MTc1MjA1NzIwMywiaXNzIjoiQ2xvdWRNYWxsQVBJIiwiYXVkIjoiQ2xvdWRNYWxsQ2xpZW50In0.5DYXwu1-T0kVDW_pJxoy6InQ8UbIrlostVDN-wMS-aQ';
    
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

  loadStores() {
    this.loading = true;
    this.error = '';
    
    // Load a larger page size to account for filtering
    const loadPageSize = this.pageSize * 5; // Load more to ensure we have enough non-deleted stores
    this.storesApi.getAllStores(1, loadPageSize, this.selectedCategory || undefined)
      .subscribe({
        next: (response: StoresResponse) => {
          // Filter out deleted stores from the main stores list
          this.stores = response.allStores.filter(store => !store.isDeleted);
          this.filteredStores = [...this.stores];
          this.totalCount = this.stores.length;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          this.currentPage = 1; // Always start from page 1 since we're loading all at once
          this.loading = false;
          this.applySearchFilter();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error loading stores:', err);
          this.error = 'Failed to load stores. Please try again.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadStores();
  }

  onSearchChange() {
    this.currentPage = 1; // Reset to first page when searching
    this.applySearchFilter();
  }

  applySearchFilter() {
    let filtered = [...this.stores];
    
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(searchLower) ||
        store.vendorName.toLowerCase().includes(searchLower) ||
        store.categoryName.toLowerCase().includes(searchLower)
      );
    }
    // Status filter
    if (this.selectedStatusFilter === 'enabled') {
      filtered = filtered.filter(store => store.isActive);
    } else if (this.selectedStatusFilter === 'disabled') {
      filtered = filtered.filter(store => !store.isActive);
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
    if (store.isDeleted) {
      return 'badge bg-danger';
    } else if (store.isActive) {
      return 'badge bg-success';
    } else {
      return 'badge bg-warning';
    }
  }

  getStatusText(store: Store): string {
    if (store.isDeleted) {
      return 'Deleted';
    } else if (store.isActive) {
      return 'Active';
    } else {
      return 'Inactive';
    }
  }

  toggleCategoryFilter() {
    this.showCategoryFilter = !this.showCategoryFilter;
  }

  toggleStatusFilter() {
    this.showStatusFilter = !this.showStatusFilter;
  }

  setStatusFilter(status: string) {
    this.selectedStatusFilter = status;
    this.currentPage = 1;
    this.applySearchFilter();
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

  deleteStore(store: Store) {
    this.storeToDelete = store;
    // Show the modal using Bootstrap
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
      const bootstrapModal = new (window as any).bootstrap.Modal(modal);
      bootstrapModal.show();
    }
  }

  confirmDelete() {
    if (!this.storeToDelete) return;
    
    this.deleting = true;
    this.error = '';
    
    this.storesApi.deleteStore(this.storeToDelete.id).subscribe({
      next: () => {
        // Remove the store from the current list
        this.stores = this.stores.filter(s => s.id !== this.storeToDelete!.id);
        this.applySearchFilter();
        this.deleting = false;
        this.storeToDelete = null;
        
        // Hide the modal
        const modal = document.getElementById('deleteConfirmModal');
        if (modal) {
          const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
          if (bootstrapModal) {
            bootstrapModal.hide();
          }
        }
        
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error deleting store:', err);
        this.error = 'Failed to delete store. Please try again.';
        this.deleting = false;
        this.cdr.markForCheck();
      }
    });
  }

  toggleStoreStatus(store: Store) {
    this.statusLoadingId = store.id;
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    const url = store.isActive
      ? `/DisableStoreByAdmin/${store.id}`
      : `/EnableStoreByAdmin/${store.id}`;
    this.storesApi.http.post<any>(`${this.storesApi.baseUrl}${url}`, {}, { headers })
      .subscribe({
        next: () => {
          store.isActive = !store.isActive;
          this.statusLoadingId = null;
          this.applySearchFilter();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.statusLoadingId = null;
          this.error = 'Failed to update store status.';
          this.cdr.markForCheck();
        }
      });
  }
}
