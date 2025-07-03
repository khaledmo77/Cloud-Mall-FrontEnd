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

export const landingRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (auth.isLoggedIn()) {
    const role = auth.getUserRole();
    if (role === 'Vendor') {
      router.navigate(['/vendor/dashboard']);
      return false;
    } else if (role === 'Client') {
      router.navigate(['/client/home']);
      return false;
    } else {
      router.navigate(['/']); // fallback
      return false;
    }
  }
  return true; // allow access to landing if not logged in
};
