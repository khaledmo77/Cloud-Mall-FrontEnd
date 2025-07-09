import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminStoresApiService, Store, StoresResponse } from '../../adminCore/admin-stores-api.service';
import { StoreCategoryApiService } from '../../adminCore/store-category-api';

@Component({
  selector: 'app-disabled-stores',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './disabled-stores.component.html',
  styleUrls: ['./disabled-stores.component.scss']
})
export class DisabledStoresComponent implements OnInit {
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
    this.loadDisabledStores();
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

  loadDisabledStores() {
    this.loading = true;
    this.error = '';
    const loadPageSize = this.pageSize * 3;
    this.storesApi.getAllStores(1, loadPageSize, this.selectedCategory || undefined)
      .subscribe({
        next: (response: StoresResponse) => {
          this.stores = response.allStores.filter(store => !store.isActive && !store.isDeleted);
          this.filteredStores = [...this.stores];
          this.totalCount = this.stores.length;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          this.currentPage = 1;
          this.loading = false;
          this.applySearchFilter();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error loading disabled stores:', err);
          this.error = 'Failed to load disabled stores. Please try again.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadDisabledStores();
  }

  onSearchChange() {
    this.currentPage = 1;
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
    this.totalCount = filtered.length;
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredStores = filtered.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.applySearchFilter();
  }

  getStatusBadgeClass(store: Store): string {
    return 'badge bg-warning';
  }

  getStatusText(store: Store): string {
    return 'Disabled';
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

  Math = Math;
} 