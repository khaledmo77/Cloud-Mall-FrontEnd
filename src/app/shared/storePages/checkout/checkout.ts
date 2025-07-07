import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClientCheckoutApiService, CheckoutRequest } from '../../../core/ClientCore/client-checkout-api.service';
import { CartService, CartItem } from '../../../core/ClientCore/client-cart-api.service';
import { OrderEventsService } from '../../../core/order-events.service';

@Component({
  selector: 'app-store-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.scss']
})
export class StoreCheckoutComponent implements OnInit {
  // Personal Details - Initialize with dummy data
  firstName = 'John';
  lastName = 'Doe';
  email = 'john.doe@example.com';
  phone = '+1 (555) 123-4567';
  address = '123 Main Street';
  city = 'New York';
  postCode = '10001';
  country = 'United States';
  region = 'region1';

  // Payment Details - Initialize with dummy data
  cardholderName = 'John Doe';
  cardNumber = '1234 5678 9012 3456';
  expiryMonth = '12';
  expiryYear = '2025';
  cvv = '123';

  // Other
  couponCode = '';
  shippingMethod = 'standard';
  cartItems: CartItem[] = [];
  totalAmount = 0;
  isSubmitting = false;
  
  // Route parameters
  vendorId?: string;
  storeId?: string;
  orderId?: string;
  checkoutId?: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private checkoutService: ClientCheckoutApiService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private orderEventsService: OrderEventsService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.handleRouteParameters();
  }

  private loadCartItems(): void {
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    });
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
    event.target.value = formattedValue;
    this.cardNumber = formattedValue;
  }

  applyCoupon(): void {
    if (this.couponCode) {
      // TODO: Implement coupon logic
      this.showSuccessToast('Coupon applied successfully!');
    } else {
      this.showErrorToast('Please enter a coupon code.');
    }
  }

  submitOrder(): void {
    // Basic validation for required API fields
    if (!this.city || !this.address) {
      this.showErrorToast('Please fill in city and address fields.');
      return;
    }

    if (this.cartItems.length === 0) {
      this.showErrorToast('Your cart is empty.');
      return;
    }

    this.isSubmitting = true;
    this.cdr.detectChanges(); // Force change detection

    // Send only the required data to the API
    const checkoutData: CheckoutRequest = {
      shippingCity: this.city,
      shippingStreetAddress: this.address
    };

    // Log the checkout data and route parameters for debugging
    console.log('Submitting checkout with data:', checkoutData);
    console.log('Route parameters:', { 
      vendorId: this.vendorId, 
      storeId: this.storeId, 
      orderId: this.orderId, 
      checkoutId: this.checkoutId 
    });

    // Check if we have the required route parameters
    if (!this.vendorId || !this.storeId) {
      console.warn('Missing vendorId or storeId - this might cause API issues');
    }

    this.checkoutService.checkout(checkoutData).subscribe({
      next: (response) => {
        console.log('Checkout successful:', response);
        this.isSubmitting = false;
        this.cdr.detectChanges(); // Force change detection
        this.showSuccessToast('Order placed successfully!');
        
        // Clear cart after successful order
        this.cartService.cleanCart();
        
        // Navigate to success page or back to store
        setTimeout(() => {
          if (this.vendorId && this.storeId) {
            this.router.navigate(['/vendor', this.vendorId, 'store', this.storeId]);
          } else {
            this.router.navigate(['/']);
          }
        }, 2000);

        // Emit order placed event
        this.orderEventsService.emitOrderPlaced(response.orderId, response);
      },
      error: (error) => {
        console.error('Checkout failed:', error);
        this.isSubmitting = false;
        this.cdr.detectChanges(); // Force change detection
        
        // Handle different error types
        if (error.status === 400) {
          this.showErrorToast('Invalid request data. Please check your shipping information.');
        } else if (error.status === 401) {
          this.showErrorToast('Authentication required. Please log in again.');
        } else if (error.status === 403) {
          this.showErrorToast('Access denied. You may not have permission to perform this action.');
        } else {
          this.showErrorToast('Failed to place order. Please try again.');
        }
      }
    });
  }

  showSuccessToast(message: string): void {
    setTimeout(() => {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    }, 0);
  }

  showErrorToast(message: string): void {
    setTimeout(() => {
      this.snackBar.open(message, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }, 0);
  }

  getShippingCost(): number {
    switch (this.shippingMethod) {
      case 'express':
        return 25.00;
      case 'overnight':
        return 50.00;
      default:
        return 10.00;
    }
  }

  getTotalWithShipping(): number {
    return this.totalAmount + this.getShippingCost();
  }

  private handleRouteParameters(): void {
    this.route.params.subscribe(params => {
      this.vendorId = params['vendorId'];
      this.storeId = params['storeId'];
      this.orderId = params['orderId'];
      this.checkoutId = params['checkoutId'];
      
      // If vendorId and storeId are not in route params, try to extract from URL
      if (!this.vendorId || !this.storeId) {
        const currentUrl = this.router.url;
        console.log('Current URL for checkout parameters:', currentUrl);
        
        // Parse the URL to extract vendorId and storeId
        // Expected format: /vendor/{vendorId}/store/{storeId}/orderid/{orderId}/checkout/{checkoutId}
        const urlParts = currentUrl.split('/');
        const vendorIndex = urlParts.findIndex(part => part === 'vendor');
        const storeIndex = urlParts.findIndex(part => part === 'store');
        
        if (vendorIndex !== -1 && storeIndex !== -1 && vendorIndex + 1 < urlParts.length && storeIndex + 1 < urlParts.length) {
          this.vendorId = urlParts[vendorIndex + 1];
          this.storeId = urlParts[storeIndex + 1];
          console.log('Extracted from URL - vendorId:', this.vendorId, 'storeId:', this.storeId);
        }
      }
      
      console.log('Route parameters loaded:', {
        vendorId: this.vendorId,
        storeId: this.storeId,
        orderId: this.orderId,
        checkoutId: this.checkoutId
      });
    });
  }
}
