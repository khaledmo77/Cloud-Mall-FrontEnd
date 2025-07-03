import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorStoreApiService, CreateStoreRequest } from '../../core/VendorCore/vendor-store-api.service';
import { GetCategoryStoresApiService, StoreCategory } from '../../core/SiteCore/Get-CategoryStores-api.service';
import { LoaderComponent } from '../../shared/loader/loader.component';

interface FilterCategory {
  filter: string;
  label: string;
}

interface DashboardItem {
  category: string;
  link: string;
  image: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './VendorDashboard.component.html',
  styleUrl: './VendorDashboard.component.scss'
})
export class VendorDashboardComponent implements OnInit, AfterViewInit {
  selectedFilter: string = '.header';
  filteredItems: DashboardItem[] = [];
  storeCategories: StoreCategory[] = [];
  
  // Popup properties
  showCreateStorePopup = false;
  isCreatingStore = false;
  createStoreForm!: FormGroup;
  selectedFile: File | null = null;
  errorMessage = '';
  successMessage = '';
  
  // Loader properties
  showLoader = false;
  createdStoreId: number | null = null;
  vendorId: string | null = null;
  
  filterCategories: FilterCategory[] = [
    { filter: '*', label: 'ALL' },
    { filter: '.navigation', label: 'navigation' },
    { filter: '.header', label: 'header' },
    { filter: '.features', label: 'features' },
    { filter: '.content', label: 'content' },
    { filter: '.team', label: 'team' },
    { filter: '.cta', label: 'cta' },
    { filter: '.gallery', label: 'gallery' },
    { filter: '.forms', label: 'forms' },
    { filter: '.partners', label: 'partners' },
    { filter: '.testimonials', label: 'testimonials' },
    { filter: '.pricing', label: 'pricing' },
    { filter: '.contact', label: 'contact' },
    { filter: '.footer', label: 'footer' }
  ];

  allItems: DashboardItem[] = [
    // Navigation items
    { category: 'navigation', link: 'blocks/navigation-1', image: 'assets/img/screenshots/blocks/navigation-1.jpg' },
    { category: 'navigation', link: 'blocks/navigation-2', image: 'assets/img/screenshots/blocks/navigation-2.jpg' },
    { category: 'navigation', link: 'blocks/navigation-3', image: 'assets/img/screenshots/blocks/navigation-3.jpg' },
    { category: 'navigation', link: 'blocks/navigation-4', image: 'assets/img/screenshots/blocks/navigation-4.jpg' },
    { category: 'navigation', link: 'blocks/navigation-5', image: 'assets/img/screenshots/blocks/navigation-5.jpg' },
    { category: 'navigation', link: 'blocks/navigation-6', image: 'assets/img/screenshots/blocks/navigation-6.jpg' },
    { category: 'navigation', link: 'blocks/navigation-7', image: 'assets/img/screenshots/blocks/navigation-7.jpg' },
    { category: 'navigation', link: 'blocks/navigation-8', image: 'assets/img/screenshots/blocks/navigation-8.jpg' },
    { category: 'navigation', link: 'blocks/navigation-9', image: 'assets/img/screenshots/blocks/navigation-9.jpg' },
    { category: 'navigation', link: 'blocks/navigation-10', image: 'assets/img/screenshots/blocks/navigation-10.jpg' },
    { category: 'navigation', link: 'blocks/navigation-11', image: 'assets/img/screenshots/blocks/navigation-11.jpg' },
    { category: 'navigation', link: 'blocks/navigation-12', image: 'assets/img/screenshots/blocks/navigation-12.jpg' },
    { category: 'navigation', link: 'blocks/navigation-13', image: 'assets/img/screenshots/blocks/navigation-13.jpg' },
    { category: 'navigation', link: 'blocks/navigation-14', image: 'assets/img/screenshots/blocks/navigation-14.jpg' },
    { category: 'navigation', link: 'blocks/navigation-15', image: 'assets/img/screenshots/blocks/navigation-15.jpg' },
    { category: 'navigation', link: 'blocks/navigation-16', image: 'assets/img/screenshots/blocks/navigation-16.jpg' },
    { category: 'navigation', link: 'blocks/navigation-17', image: 'assets/img/screenshots/blocks/navigation-17.jpg' },
    { category: 'navigation', link: 'blocks/navigation-18', image: 'assets/img/screenshots/blocks/navigation-18.jpg' },
    { category: 'navigation', link: 'blocks/navigation-19', image: 'assets/img/screenshots/blocks/navigation-19.jpg' },
    { category: 'navigation', link: 'blocks/navigation-20', image: 'assets/img/screenshots/blocks/navigation-20.jpg' },
    { category: 'navigation', link: 'blocks/navigation-21', image: 'assets/img/screenshots/blocks/navigation-21.jpg' },
    { category: 'navigation', link: 'blocks/navigation-22', image: 'assets/img/screenshots/blocks/navigation-22.jpg' },
    { category: 'navigation', link: 'blocks/navigation-23', image: 'assets/img/screenshots/blocks/navigation-23.jpg' },
    { category: 'navigation', link: 'blocks/navigation-24', image: 'assets/img/screenshots/blocks/navigation-24.jpg' },
    { category: 'navigation', link: 'blocks/navigation-25', image: 'assets/img/screenshots/blocks/navigation-25.jpg' },
    { category: 'navigation', link: 'blocks/navigation-26', image: 'assets/img/screenshots/blocks/navigation-26.jpg' },
    { category: 'navigation', link: 'blocks/navigation-27', image: 'assets/img/screenshots/blocks/navigation-27.jpg' },
    { category: 'navigation', link: 'blocks/navigation-28', image: 'assets/img/screenshots/blocks/navigation-28.jpg' },
    
    // Header items
    { category: 'header', link: 'blocks/header-1', image: 'assets/img/screenshots/blocks/header-1.jpg' },
    { category: 'header', link: 'blocks/header-2', image: 'assets/img/screenshots/blocks/header-2.jpg' },
    { category: 'header', link: 'blocks/header-3', image: 'assets/img/screenshots/blocks/header-3.jpg' },
    { category: 'header', link: 'blocks/header-4', image: 'assets/img/screenshots/blocks/header-4.jpg' },
    { category: 'header', link: 'blocks/header-5', image: 'assets/img/screenshots/blocks/header-5.jpg' },
    { category: 'header', link: 'blocks/header-6', image: 'assets/img/screenshots/blocks/header-6.jpg' },
    { category: 'header', link: 'blocks/header-7', image: 'assets/img/screenshots/blocks/header-7.jpg' },
    { category: 'header', link: 'blocks/header-8', image: 'assets/img/screenshots/blocks/header-8.jpg' },
    { category: 'header', link: 'blocks/header-9', image: 'assets/img/screenshots/blocks/header-9.jpg' },
    { category: 'header', link: 'blocks/header-10', image: 'assets/img/screenshots/blocks/header-10.jpg' },
    { category: 'header', link: 'blocks/header-11', image: 'assets/img/screenshots/blocks/header-11.jpg' },
    { category: 'header', link: 'blocks/header-12', image: 'assets/img/screenshots/blocks/header-12.jpg' },
    { category: 'header', link: 'blocks/header-13', image: 'assets/img/screenshots/blocks/header-13.jpg' },
    { category: 'header', link: 'blocks/header-14', image: 'assets/img/screenshots/blocks/header-14.jpg' },
    { category: 'header', link: 'blocks/header-15', image: 'assets/img/screenshots/blocks/header-15.jpg' },
    { category: 'header', link: 'blocks/header-16', image: 'assets/img/screenshots/blocks/header-16.jpg' },
    { category: 'header', link: 'blocks/header-17', image: 'assets/img/screenshots/blocks/header-17.jpg' },
    
    // Features items
    { category: 'features', link: 'blocks/features-1', image: 'assets/img/screenshots/blocks/features-1.jpg' },
    { category: 'features', link: 'blocks/features-2', image: 'assets/img/screenshots/blocks/features-2.jpg' },
    { category: 'features', link: 'blocks/features-3', image: 'assets/img/screenshots/blocks/features-3.jpg' },
    { category: 'features', link: 'blocks/features-4', image: 'assets/img/screenshots/blocks/features-4.jpg' },
    { category: 'features', link: 'blocks/features-5', image: 'assets/img/screenshots/blocks/features-5.jpg' },
    { category: 'features', link: 'blocks/features-6', image: 'assets/img/screenshots/blocks/features-6.jpg' },
    { category: 'features', link: 'blocks/features-7', image: 'assets/img/screenshots/blocks/features-7.jpg' },
    { category: 'features', link: 'blocks/features-8', image: 'assets/img/screenshots/blocks/features-8.jpg' },
    { category: 'features', link: 'blocks/features-9', image: 'assets/img/screenshots/blocks/features-9.jpg' },
    { category: 'features', link: 'blocks/features-10', image: 'assets/img/screenshots/blocks/features-10.jpg' },
    { category: 'features', link: 'blocks/features-11', image: 'assets/img/screenshots/blocks/features-11.jpg' },
    { category: 'features', link: 'blocks/features-12', image: 'assets/img/screenshots/blocks/features-12.jpg' },
    { category: 'features', link: 'blocks/features-13', image: 'assets/img/screenshots/blocks/features-13.jpg' },
    { category: 'features', link: 'blocks/features-14', image: 'assets/img/screenshots/blocks/features-14.jpg' },
    { category: 'features', link: 'blocks/features-15', image: 'assets/img/screenshots/blocks/features-15.jpg' },
    { category: 'features', link: 'blocks/features-16', image: 'assets/img/screenshots/blocks/features-16.jpg' },
    { category: 'features', link: 'blocks/features-17', image: 'assets/img/screenshots/blocks/features-17.jpg' },
    { category: 'features', link: 'blocks/features-18', image: 'assets/img/screenshots/blocks/features-18.jpg' },
    { category: 'features', link: 'blocks/features-19', image: 'assets/img/screenshots/blocks/features-19.jpg' },
    { category: 'features', link: 'blocks/features-20', image: 'assets/img/screenshots/blocks/features-20.jpg' },
    { category: 'features', link: 'blocks/features-21', image: 'assets/img/screenshots/blocks/features-21.jpg' },
    { category: 'features', link: 'blocks/features-22', image: 'assets/img/screenshots/blocks/features-22.jpg' },
    
    // Content items
    { category: 'content', link: 'blocks/content-1', image: 'assets/img/screenshots/blocks/content-1.jpg' },
    { category: 'content', link: 'blocks/content-2', image: 'assets/img/screenshots/blocks/content-2.jpg' },
    { category: 'content', link: 'blocks/content-3', image: 'assets/img/screenshots/blocks/content-3.jpg' },
    { category: 'content', link: 'blocks/content-4', image: 'assets/img/screenshots/blocks/content-4.jpg' },
    { category: 'content', link: 'blocks/content-5', image: 'assets/img/screenshots/blocks/content-5.jpg' },
    { category: 'content', link: 'blocks/content-6', image: 'assets/img/screenshots/blocks/content-6.jpg' },
    { category: 'content', link: 'blocks/content-7', image: 'assets/img/screenshots/blocks/content-7.jpg' },
    { category: 'content', link: 'blocks/content-8', image: 'assets/img/screenshots/blocks/content-8.jpg' },
    { category: 'content', link: 'blocks/content-9', image: 'assets/img/screenshots/blocks/content-9.jpg' },
    { category: 'content', link: 'blocks/content-10', image: 'assets/img/screenshots/blocks/content-10.jpg' },
    { category: 'content', link: 'blocks/content-11', image: 'assets/img/screenshots/blocks/content-11.jpg' },
    { category: 'content', link: 'blocks/content-12', image: 'assets/img/screenshots/blocks/content-12.jpg' },
    { category: 'content', link: 'blocks/content-13', image: 'assets/img/screenshots/blocks/content-13.jpg' },
    { category: 'content', link: 'blocks/content-14', image: 'assets/img/screenshots/blocks/content-14.jpg' },
    { category: 'content', link: 'blocks/content-15', image: 'assets/img/screenshots/blocks/content-15.jpg' },
    { category: 'content', link: 'blocks/content-16', image: 'assets/img/screenshots/blocks/content-16.jpg' },
    { category: 'content', link: 'blocks/content-17', image: 'assets/img/screenshots/blocks/content-17.jpg' },
    { category: 'content', link: 'blocks/content-18', image: 'assets/img/screenshots/blocks/content-18.jpg' },
    { category: 'content', link: 'blocks/content-19', image: 'assets/img/screenshots/blocks/content-19.jpg' },
    { category: 'content', link: 'blocks/content-20', image: 'assets/img/screenshots/blocks/content-20.jpg' },
    { category: 'content', link: 'blocks/content-21', image: 'assets/img/screenshots/blocks/content-21.jpg' },
    { category: 'content', link: 'blocks/content-22', image: 'assets/img/screenshots/blocks/content-22.jpg' },
    { category: 'content', link: 'blocks/content-23', image: 'assets/img/screenshots/blocks/content-23.jpg' },
    { category: 'content', link: 'blocks/content-24', image: 'assets/img/screenshots/blocks/content-24.jpg' },
    { category: 'content', link: 'blocks/content-25', image: 'assets/img/screenshots/blocks/content-25.jpg' },
    { category: 'content', link: 'blocks/content-26', image: 'assets/img/screenshots/blocks/content-26.jpg' },
    { category: 'content', link: 'blocks/content-27', image: 'assets/img/screenshots/blocks/content-27.jpg' },
    { category: 'content', link: 'blocks/content-28', image: 'assets/img/screenshots/blocks/content-28.jpg' },
    
    // Team items
    { category: 'team', link: 'blocks/team-1', image: 'assets/img/screenshots/blocks/team-1.jpg' },
    { category: 'team', link: 'blocks/team-2', image: 'assets/img/screenshots/blocks/team-2.jpg' },
    { category: 'team', link: 'blocks/team-3', image: 'assets/img/screenshots/blocks/team-3.jpg' },
    { category: 'team', link: 'blocks/team-4', image: 'assets/img/screenshots/blocks/team-4.jpg' },
    { category: 'team', link: 'blocks/team-5', image: 'assets/img/screenshots/blocks/team-5.jpg' },
    
    // CTA items
    { category: 'cta', link: 'blocks/cta-1', image: 'assets/img/screenshots/blocks/cta-1.jpg' },
    { category: 'cta', link: 'blocks/cta-2', image: 'assets/img/screenshots/blocks/cta-2.jpg' },
    { category: 'cta', link: 'blocks/cta-3', image: 'assets/img/screenshots/blocks/cta-3.jpg' },
    { category: 'cta', link: 'blocks/cta-4', image: 'assets/img/screenshots/blocks/cta-4.jpg' },
    { category: 'cta', link: 'blocks/cta-5', image: 'assets/img/screenshots/blocks/cta-5.jpg' },
    { category: 'cta', link: 'blocks/cta-6', image: 'assets/img/screenshots/blocks/cta-6.jpg' },
    { category: 'cta', link: 'blocks/cta-7', image: 'assets/img/screenshots/blocks/cta-7.jpg' },
    { category: 'cta', link: 'blocks/cta-8', image: 'assets/img/screenshots/blocks/cta-8.jpg' },
    { category: 'cta', link: 'blocks/cta-9', image: 'assets/img/screenshots/blocks/cta-9.jpg' },
    { category: 'cta', link: 'blocks/cta-10', image: 'assets/img/screenshots/blocks/cta-10.jpg' },
    { category: 'cta', link: 'blocks/cta-11', image: 'assets/img/screenshots/blocks/cta-11.jpg' },
    { category: 'cta', link: 'blocks/cta-12', image: 'assets/img/screenshots/blocks/cta-12.jpg' },
    { category: 'cta', link: 'blocks/cta-13', image: 'assets/img/screenshots/blocks/cta-13.jpg' },
    { category: 'cta', link: 'blocks/cta-14', image: 'assets/img/screenshots/blocks/cta-14.jpg' },
    { category: 'cta', link: 'blocks/cta-15', image: 'assets/img/screenshots/blocks/cta-15.jpg' },
    { category: 'cta', link: 'blocks/cta-16', image: 'assets/img/screenshots/blocks/cta-16.jpg' },
    { category: 'cta', link: 'blocks/cta-17', image: 'assets/img/screenshots/blocks/cta-17.jpg' },
    { category: 'cta', link: 'blocks/cta-18', image: 'assets/img/screenshots/blocks/cta-18.jpg' },
    { category: 'cta', link: 'blocks/cta-19', image: 'assets/img/screenshots/blocks/cta-19.jpg' },
    { category: 'cta', link: 'blocks/cta-20', image: 'assets/img/screenshots/blocks/cta-20.jpg' },
    { category: 'cta', link: 'blocks/cta-21', image: 'assets/img/screenshots/blocks/cta-21.jpg' },
    
    // Gallery items
    { category: 'gallery', link: 'blocks/gallery-1', image: 'assets/img/screenshots/blocks/gallery-1.jpg' },
    { category: 'gallery', link: 'blocks/gallery-2', image: 'assets/img/screenshots/blocks/gallery-2.jpg' },
    { category: 'gallery', link: 'blocks/gallery-3', image: 'assets/img/screenshots/blocks/gallery-3.jpg' },
    
    // Forms items
    { category: 'forms', link: 'blocks/forms-1', image: 'assets/img/screenshots/blocks/forms-1.jpg' },
    { category: 'forms', link: 'blocks/forms-2', image: 'assets/img/screenshots/blocks/forms-2.jpg' },
    { category: 'forms', link: 'blocks/forms-3', image: 'assets/img/screenshots/blocks/forms-3.jpg' },
    { category: 'forms', link: 'blocks/forms-4', image: 'assets/img/screenshots/blocks/forms-4.jpg' },
    { category: 'forms', link: 'blocks/forms-5', image: 'assets/img/screenshots/blocks/forms-5.jpg' },
    { category: 'forms', link: 'blocks/forms-6', image: 'assets/img/screenshots/blocks/forms-6.jpg' },
    { category: 'forms', link: 'blocks/forms-7', image: 'assets/img/screenshots/blocks/forms-7.jpg' },
    { category: 'forms', link: 'blocks/forms-8', image: 'assets/img/screenshots/blocks/forms-8.jpg' },
    { category: 'forms', link: 'blocks/forms-9', image: 'assets/img/screenshots/blocks/forms-9.jpg' },
    { category: 'forms', link: 'blocks/forms-10', image: 'assets/img/screenshots/blocks/forms-10.jpg' },
    { category: 'forms', link: 'blocks/forms-11', image: 'assets/img/screenshots/blocks/forms-11.jpg' },
    { category: 'forms', link: 'blocks/forms-12', image: 'assets/img/screenshots/blocks/forms-12.jpg' },
    { category: 'forms', link: 'blocks/forms-13', image: 'assets/img/screenshots/blocks/forms-13.jpg' },
    { category: 'forms', link: 'blocks/forms-14', image: 'assets/img/screenshots/blocks/forms-14.jpg' },
    
    // Partners items
    { category: 'partners', link: 'blocks/partners-1', image: 'assets/img/screenshots/blocks/partners-1.jpg' },
    { category: 'partners', link: 'blocks/partners-2', image: 'assets/img/screenshots/blocks/partners-2.jpg' },
    { category: 'partners', link: 'blocks/partners-3', image: 'assets/img/screenshots/blocks/partners-3.jpg' },
    { category: 'partners', link: 'blocks/partners-4', image: 'assets/img/screenshots/blocks/partners-4.jpg' },
    
    // Testimonials items
    { category: 'testimonials', link: 'blocks/testimonials-1', image: 'assets/img/screenshots/blocks/testimonials-1.jpg' },
    { category: 'testimonials', link: 'blocks/testimonials-2', image: 'assets/img/screenshots/blocks/testimonials-2.jpg' },
    { category: 'testimonials', link: 'blocks/testimonials-3', image: 'assets/img/screenshots/blocks/testimonials-3.jpg' },
    { category: 'testimonials', link: 'blocks/testimonials-4', image: 'assets/img/screenshots/blocks/testimonials-4.jpg' },
    
    // Pricing items
    { category: 'pricing', link: 'blocks/pricing-1', image: 'assets/img/screenshots/blocks/pricing-1.jpg' },
    { category: 'pricing', link: 'blocks/pricing-2', image: 'assets/img/screenshots/blocks/pricing-2.jpg' },
    { category: 'pricing', link: 'blocks/pricing-3', image: 'assets/img/screenshots/blocks/pricing-3.jpg' },
    { category: 'pricing', link: 'blocks/pricing-4', image: 'assets/img/screenshots/blocks/pricing-4.jpg' },
    { category: 'pricing', link: 'blocks/pricing-5', image: 'assets/img/screenshots/blocks/pricing-5.jpg' },
    { category: 'pricing', link: 'blocks/pricing-6', image: 'assets/img/screenshots/blocks/pricing-6.jpg' },
    { category: 'pricing', link: 'blocks/pricing-7', image: 'assets/img/screenshots/blocks/pricing-7.jpg' },
    
    // Contact items
    { category: 'contact', link: 'blocks/contact-1', image: 'assets/img/screenshots/blocks/contact-1.jpg' },
    { category: 'contact', link: 'blocks/contact-2', image: 'assets/img/screenshots/blocks/contact-2.jpg' },
    { category: 'contact', link: 'blocks/contact-3', image: 'assets/img/screenshots/blocks/contact-3.jpg' },
    { category: 'contact', link: 'blocks/contact-4', image: 'assets/img/screenshots/blocks/contact-4.jpg' },
    { category: 'contact', link: 'blocks/contact-5', image: 'assets/img/screenshots/blocks/contact-5.jpg' },
    { category: 'contact', link: 'blocks/contact-6', image: 'assets/img/screenshots/blocks/contact-6.jpg' },
    
    // Footer items
    { category: 'footer', link: 'blocks/footer-1', image: 'assets/img/screenshots/blocks/footer-1.jpg' },
    { category: 'footer', link: 'blocks/footer-2', image: 'assets/img/screenshots/blocks/footer-2.jpg' },
    { category: 'footer', link: 'blocks/footer-3', image: 'assets/img/screenshots/blocks/footer-3.jpg' },
    { category: 'footer', link: 'blocks/footer-4', image: 'assets/img/screenshots/blocks/footer-4.jpg' },
    { category: 'footer', link: 'blocks/footer-5', image: 'assets/img/screenshots/blocks/footer-5.jpg' },
    { category: 'footer', link: 'blocks/footer-6', image: 'assets/img/screenshots/blocks/footer-6.jpg' },
    { category: 'footer', link: 'blocks/footer-7', image: 'assets/img/screenshots/blocks/footer-7.jpg' },
    { category: 'footer', link: 'blocks/footer-8', image: 'assets/img/screenshots/blocks/footer-8.jpg' },
    { category: 'footer', link: 'blocks/footer-9', image: 'assets/img/screenshots/blocks/footer-9.jpg' },
    { category: 'footer', link: 'blocks/footer-10', image: 'assets/img/screenshots/blocks/footer-10.jpg' },
    { category: 'footer', link: 'blocks/footer-11', image: 'assets/img/screenshots/blocks/footer-11.jpg' },
    { category: 'footer', link: 'blocks/footer-12', image: 'assets/img/screenshots/blocks/footer-12.jpg' },
    { category: 'footer', link: 'blocks/footer-13', image: 'assets/img/screenshots/blocks/footer-13.jpg' }
  ];

  constructor(
    private storeService: VendorStoreApiService,
    private categoryService: GetCategoryStoresApiService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize form
    this.createStoreForm = this.fb.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      StoreCategoryID: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.filterItems('.header');
    this.loadStoreCategories();
    
    // Get vendor ID from localStorage (stored as 'userId' during login)
    if (typeof window !== 'undefined' && window.localStorage) {
      this.vendorId = localStorage.getItem('userId');
      console.log('Vendor ID from localStorage (userId):', this.vendorId);
    }
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.initializeDashboard();
    }
  }

  private loadStoreCategories() {
    this.categoryService.getStoreCategories().subscribe({
      next: (categories) => {
        this.storeCategories = categories;
      },
      error: (error) => {
        console.error('Error loading store categories:', error);
      }
    });
  }

  openCreateStorePopup() {
    this.resetForm(); // Initialize form when opening popup
    this.showCreateStorePopup = true;
  }

  closeCreateStorePopup() {
    console.log('Closing create store popup...');
    this.showCreateStorePopup = false;
    console.log('Popup closed, showCreateStorePopup:', this.showCreateStorePopup);
  }

  resetForm() {
    this.createStoreForm = this.fb.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required],
      StoreCategoryID: [null, Validators.required]
    });
    this.selectedFile = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  createStore() {
    if (this.createStoreForm.valid) {
      console.log('Creating store...');
      // Capture form data before closing popup
      const storeData: CreateStoreRequest = {
        Name: this.createStoreForm.get('Name')?.value || '',
        Description: this.createStoreForm.get('Description')?.value || '',
        StoreCategoryID: this.createStoreForm.get('StoreCategoryID')?.value || 0,
        LogoFile: this.selectedFile || undefined
      };
      // Close popup first before showing loader
      this.closeCreateStorePopup();
      this.showLoader = true;
      this.storeService.createStore(storeData).subscribe({
        next: (response) => {
          console.log('Store creation response:', response);
          // Handle different response formats
          let isSuccess = false;
          let storeId: number | null = null;
          if (response.success) {
            isSuccess = true;
            // Check for store ID in different possible locations
            storeId = response.storeId || response.id || response.data || null;
          } else if (response) {
            // If response exists but no clear success flag, assume success
            isSuccess = true;
            storeId = response.storeId || response.id || response.data || null;
          }
          if (isSuccess) {
            this.successMessage = 'Store created successfully!';
            this.createdStoreId = storeId;
            console.log('Store created successfully. Store ID:', this.createdStoreId);
            console.log('Vendor ID:', this.vendorId);
            // Navigate to store preview after a short delay to show the loader
            setTimeout(() => {
              if (this.createdStoreId && this.vendorId) {
                const route = ['/vendor', this.vendorId, 'store', this.createdStoreId];
                this.router.navigate(route);
              }
              this.showLoader = false;
            }, 2000);
          } else {
            this.errorMessage = response.message || 'Failed to create store.';
            this.showLoader = false;
          }
        },
        error: (error) => {
          console.error('Error creating store:', error);
          this.errorMessage = 'An error occurred while creating the store.';
          this.showLoader = false;
        }
      });
    }
  }

  private initializeDashboard() {
    // Hide preloader after page loads
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }
    }, 1000);

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar-slick');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    // Initialize isotope filtering
    this.initializeIsotope();
  }

  filterItems(filter: string) {
    this.selectedFilter = filter;
    
    if (filter === '*') {
      this.filteredItems = this.allItems;
    } else {
      const category = filter.replace('.', '');
      this.filteredItems = this.allItems.filter(item => item.category === category);
    }
    
    // Update isotope layout after filtering
    setTimeout(() => {
      this.initializeIsotope();
    }, 100);
  }

  private initializeIsotope() {
    // Isotope initialization code remains the same
    if (typeof window !== 'undefined' && (window as any).Isotope) {
      const grid = document.querySelector('.isotope-container');
      if (grid) {
        new (window as any).Isotope(grid, {
          itemSelector: '.isotope-item',
          layoutMode: 'fitRows',
          transitionDuration: '0.4s'
        });
      }
    }
  }
}
