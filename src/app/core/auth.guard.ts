import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    // If not in browser environment (SSR), allow access and let client-side handle auth
    if (!isPlatformBrowser(platformId)) {
      return true;
    }

    const role = auth.getUserRole();

    if (!role || !allowedRoles.includes(role)) {
      if (role === 'Vendor') {
        router.navigate(['/vendor/login']);
      } else {
        router.navigate(['/client/login']);
      }
      return false;
    }

    return true;
  };
};
