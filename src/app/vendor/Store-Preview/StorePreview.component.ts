import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-StorePreview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './StorePreview.component.html',
  styleUrl: './StorePreview.component.scss'
})
export class StorePreviewComponent implements OnInit, OnDestroy {
  vendorId: string | null = null;
  storeId: number | null = null;
  storeData: any = null;
  isLoading = true;
  private isDestroyed = false;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Get route parameters using paramMap for better handling
    this.route.paramMap.subscribe(params => {
      this.vendorId = params.get('vendorId');
      const storeIdParam = params.get('storeId');
      this.storeId = storeIdParam ? parseInt(storeIdParam) : null;
      
      if (this.vendorId && this.storeId) {
        this.loadStoreData();
      } else {
        console.error('StorePreview - Missing vendorId or storeId:', { 
          vendorId: this.vendorId, 
          storeId: this.storeId,
          vendorIdType: typeof this.vendorId,
          storeIdType: typeof this.storeId,
          storeIdParam: storeIdParam
        });
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.isDestroyed = true;
  }

  private loadStoreData() {
    // For now, we'll just simulate loading store data
    // In the future, this would call an API to get store details
    setTimeout(() => {
      // Check if component is still alive
      if (this.isDestroyed) {
        return;
      }
      
      this.storeData = {
        id: this.storeId,
        name: 'Your New Store',
        description: 'Store description will be loaded here',
        category: 'General Store',
        logoUrl: 'assets/img/logo.png',
        vendorId: this.vendorId
      };
      this.isLoading = false;
      
      // Force change detection
      if (!this.isDestroyed) {
        this.cdr.detectChanges();
      }
    }, 1000);
  }
}
