import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './client/Layout/layout.component';
import { ClientHomeComponent } from './client/Home/home.component';
import { VendorLayoutComponent } from './vendor/layout.component';
import { VendorHomeComponent } from './vendor/home.component';
import { AdminLayoutComponent } from './admin/layout.component';
import { AdminHomeComponent } from './admin/home.component';
import { DeliveryLayoutComponent } from './delivery/layout.component';
import { DeliveryHomeComponent } from './delivery/home.component';
import { roleGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'client',
    component: ClientLayoutComponent,
    children: [{ path: '', component: ClientHomeComponent }],
  },
  {
    path: 'vendor',
    component: VendorLayoutComponent,
    children: [{ path: '', component: VendorHomeComponent }],
  },
  {
    path: 'admin',
    canActivate: [roleGuard(['Admin'])],
    component: AdminLayoutComponent,
    children: [{ path: '', component: AdminHomeComponent }],
  },
  {
    path: 'delivery',
    component: DeliveryLayoutComponent,
    children: [{ path: '', component: DeliveryHomeComponent }],
  },
  { path: '', redirectTo: '/client', pathMatch: 'full' },
  { path: '**', redirectTo: '/client' },
];
