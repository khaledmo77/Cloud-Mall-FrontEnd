import { Routes } from '@angular/router';
import { DeliveryLayoutComponent, DeliveryHomeComponent } from './index';
import { roleGuard } from '../core/auth.guard';

export const DELIVERY_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['Delivery'])],
    component: DeliveryLayoutComponent,
    children: [
      { path: '', component: DeliveryHomeComponent },
    ],
  },
]; 