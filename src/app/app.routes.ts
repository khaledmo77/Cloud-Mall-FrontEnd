import { LoginComponent } from './shared/login/login.component';
import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './client/Layout/layout.component';
import { ClientHomeComponent } from './client/Home/home.component';
import { VendorLayoutComponent } from './vendor/Layout/layout.component';
import { VendorHomeComponent } from './vendor/Home/home.component';
import { AdminLayoutComponent } from './admin/Layout/layout.component';
import { AdminHomeComponent } from './admin/Home/home.component';
import { DeliveryLayoutComponent } from './delivery/Layout/layout.component';
import { DeliveryHomeComponent } from './delivery/Home/home.component';
import { roleGuard } from './core/auth.guard';

export const routes: Routes = [
  {path: 'login',component: LoginComponent},
  {
    path: 'client',
    component: ClientLayoutComponent,
    children: [{ path: '', component: ClientHomeComponent },
     
    ],
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
