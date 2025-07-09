import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreCategoryApiService } from '../../adminCore/store-category-api';

@Component({
  selector: 'app-store-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store-categories.component.html',
  styleUrls: ['./store-categories.component.scss']
})
export class StoreCategoriesComponent implements OnInit {
  categories: any[] = [];
  loading = true;
  error = '';
  showAdd = false;
  adding = false;
  newCategory = { name: '', description: '' };

  constructor(private storeCategoryApi: StoreCategoryApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    const token = localStorage.getItem('token') || '';
    
    this.storeCategoryApi.getAllCategoriesByAdmin(token).subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.error = 'Failed to load categories.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  addCategory() {
    if (!this.newCategory.name || !this.newCategory.description) return;
    this.adding = true;
    const token = localStorage.getItem('token') || '';
    this.storeCategoryApi.createCategory(token, this.newCategory.name, this.newCategory.description).subscribe({
      next: () => {
        this.adding = false;
        this.showAdd = false;
        this.newCategory = { name: '', description: '' };
        this.loadCategories();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.adding = false;
        this.error = 'Failed to add category.';
        this.cdr.markForCheck();
      }
    });
  }
}
