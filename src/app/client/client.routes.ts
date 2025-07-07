import { Routes } from '@angular/router';
import { 
  ClientLayoutComponent, 
  ClientHomeComponent, 
  StoreListComponent, 
  StoreDetailsComponent, 
  ProductDetailsComponent, 
  OrdersComponent, 
  CartComponent
} from './index';
import { roleGuard } from '../core/auth.guard';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['Client'])],
    component: ClientLayoutComponent,
    children: [
      { path: '', component: StoreListComponent },
      { path: 'home', component: ClientHomeComponent },
      { path: 'store-list', component: StoreListComponent },
      { path: 'store-details/:id', component: StoreDetailsComponent },
      { path: 'product-details', component: ProductDetailsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'cart', component: CartComponent },
    ],
  },
]; 