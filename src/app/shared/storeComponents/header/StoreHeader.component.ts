import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService, CartItem } from '../../../core/ClientCore/client-cart-api.service';
import { AuthService } from '../../../core/auth.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-StoreHeader',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './StoreHeader.component.html',
  styleUrl: './StoreHeader.component.scss'
})
export class StoreHeader implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalCount = 0;
  totalAmount = 0;
  total$!: Observable<number>;
  isVendor = false;
  private cartSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
      this.totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
      this.totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    });
    
    // Initialize total$ observable
    this.total$ = this.cartService.total$;
    
    // Check if user is vendor
    this.isVendor = this.authService.getUserRole() === 'Vendor';
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.cleanCart();
  }
}
