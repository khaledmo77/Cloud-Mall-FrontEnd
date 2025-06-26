import { Routes } from '@angular/router';

// Shared Components
import { LandingPageComponent } from './shared/landingPage/LandingPage.component';

// Client
import { clientLoginComponent } from './client/ClientAuth/Login/ClientLogin.component';
import { ClientRegisterComponent } from './client/ClientAuth/Register/ClientRegister.component';
import { ClientLayoutComponent } from './client/Layout/Clientlayout.component';
import { ClientHomeComponent } from './client/Home/home.component';
import { StoreListComponent } from './client/store-list/store-list.component';
import { StoreDetailsComponent } from './client/store-details/store-details.component';
import { ProductDetailsComponent } from './client/product-details/product-details.component';
import { OrdersComponent } from './client/orders/orders.component';
import { CartComponent } from './client/cart/cart.component';
import { CheckoutComponent } from './client/checkout/checkout.component';

// Vendor
import { VendorLoginComponent } from './vendor/VendorAuth/Login/VendorLogin.component';
import { VendorRegisterComponent } from './vendor/VendorAuth/Register/VendorRegister.component';
import { VendorLayoutComponent } from './vendor/Layout/Vendorlayout.component';
import { VendorHomeComponent } from './vendor/Home/Vendorhome.component';
import { VendorDashboardComponent } from './vendor/VendorDashboard/VendorDashboard.component';
import { CreateStoreComponent } from './vendor/Create-Store/CreateStore.Component';
import { StoreSettingsComponent } from './vendor/Store-Settings/StoreSettings.component';
import { StorePreviewComponent } from './vendor/Store-Preview/StorePreview.component';
import { ManageProductsComponent } from './vendor/Manage-Products/ManageProducts.component';
import { VendorOrdersComponent } from './vendor/Orders/VendorOrders.component';

// Admin
import { AdminLayoutComponent } from './admin/Layout/layout.component';
import { AdminHomeComponent } from './admin/Home/home.component';

// Delivery
import { DeliveryLayoutComponent } from './delivery/Layout/layout.component';
import { DeliveryHomeComponent } from './delivery/Home/home.component';

// Auth Guard
import { roleGuard } from './core/auth.guard';

export const routes: Routes = [
  // Shared Landing Page
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingPageComponent },


  // 🔹 Client Protected Area
  {
    path: 'client',
    canActivate: [roleGuard(['Client'])],
    component: ClientLayoutComponent,
    children: [
      { path: '', component: ClientHomeComponent },
      { path: 'store-list', component: StoreListComponent },
      { path: 'store-details/:id', component: StoreDetailsComponent },
      { path: 'product-details', component: ProductDetailsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
    ],
  },

  // 🔹 Vendor Protected Area
  {
    path: 'vendor',
    canActivate: [roleGuard(['Vendor'])],
    component: VendorLayoutComponent,
    children: [
      { path: '', component: VendorHomeComponent },
      { path: 'dashboard', component: VendorDashboardComponent },
      { path: 'create-store', component: CreateStoreComponent },
      { path: 'store-settings', component: StoreSettingsComponent },
      { path: 'store-preview', component: StorePreviewComponent },
      { path: 'manage-products', component: ManageProductsComponent },
      { path: 'orders', component: VendorOrdersComponent },
    ],
  },

  // 🔹 Admin Protected Area
  {
    path: 'admin',
    canActivate: [roleGuard(['Admin'])],
    component: AdminLayoutComponent,
    children: [{ path: '', component: AdminHomeComponent }],
  },

  // 🔹 Delivery Protected Area
  {
    path: 'delivery',
    canActivate: [roleGuard(['Delivery'])],
    component: DeliveryLayoutComponent,
    children: [{ path: '', component: DeliveryHomeComponent }],
  },

  // Fallback
  { path: '**', redirectTo: '/landing' }
];
