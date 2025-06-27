import { Routes } from '@angular/router';
import { AdminLayoutComponent, AdminHomeComponent } from './index';
import { roleGuard } from '../core/auth.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard(['Admin'])],
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminHomeComponent },
    ],
  },
]; 