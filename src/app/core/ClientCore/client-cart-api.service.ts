import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}


@Injectable({
  providedIn: 'root'
})

export class CartService{
     private cart: CartItem[] = [];
     private cartSubject = new BehaviorSubject<CartItem[]>([]);//holds the cart items as first empty cart.

     cart$ = this.cartSubject.asObservable(); //"observable"to protect the cart state from being changed
     
      constructor() {
    // Load cart from localStorage if it exists
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.cartSubject.next(this.cart);
    }
  }
   private updateCartState() {
    this.cartSubject.next(this.cart); // update observable
    localStorage.setItem('cart', JSON.stringify(this.cart)); // save in storage
  }
     addToCart(product: CartItem){   //to add products to cart
          const existing = this.cart.find(p => p.productId === product.productId);//to get product with same id i found so will be saved in existing variable 
           if (existing) {
            existing.quantity += product.quantity;//add same product so inc its quantity
           } else {
           this.cart.push(product);//not found so add it for first time
           }
           this.updateCartState();
     }

     removeFromCart(productId: number){
        this.cart = this.cart.filter(p => p.productId !== productId);
        this.cartSubject.next(this.cart);
     }

     cleanCart(){
        this.cart = [];
        this.cartSubject.next(this.cart);
     }

     



}