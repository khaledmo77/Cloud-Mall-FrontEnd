import { Routes } from '@angular/router';

// Shared Components
import { LandingPageComponent } from './shared/landingPage/LandingPage.component';

export const routes: Routes = [
  // Shared Landing Page (eager loaded)
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingPageComponent },

  // 🔹 Shared Authentication Routes (eager loaded)
  {
    path: '',
    loadChildren: () => import('./shared/shared.routes').then(m => m.SHARED_ROUTES)
  },

  // 🔹 Client Protected Area (lazy loaded)
  {
    path: 'client',
    loadChildren: () => import('./client/client.routes').then(m => m.CLIENT_ROUTES)
  },

  // 🔹 Vendor Protected Area (lazy loaded)
  {
    path: 'vendor',
    loadChildren: () => import('./vendor/vendor.routes').then(m => m.VENDOR_ROUTES)
  },

  // 🔹 Admin Protected Area (lazy loaded)
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // 🔹 Delivery Protected Area (lazy loaded)
  {
    path: 'delivery',
    loadChildren: () => import('./delivery/delivery.routes').then(m => m.DELIVERY_ROUTES)
  },

  // Fallback
  { path: '**', redirectTo: '/landing' }
];
