import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CartItem {
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

     addToCart(product: CartItem){   //to add products to cart
          const existing = this.cart.find(p => p.productId === product.productId);//to get product with same id i found so will be saved in existing variable 
           if (existing) {
            existing.quantity += product.quantity;//add same product so inc its quantity
           } else {
           this.cart.push(product);//not found so add it for first time
           }
          this.cartSubject.next(this.cart);//your cart page count stays in sync ,subscriber that the cart was updated.
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