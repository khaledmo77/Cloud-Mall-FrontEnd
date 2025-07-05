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
    console.log('roleGuard - checking role:', role, 'against allowed roles:', allowedRoles);

    if (!role || !allowedRoles.includes(role)) {
      console.log('roleGuard - Access denied for role:', role);
      if (role === 'Vendor') {
        router.navigate(['/vendor/login']);
      } else {
        router.navigate(['/client/login']);
      }
      return false;
    }

    console.log('roleGuard - Access granted for role:', role);
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

  // Debug logging
  console.log('landingRedirectGuard - isLoggedIn:', auth.isLoggedIn());
  console.log('landingRedirectGuard - role:', auth.getUserRole());
  console.log('landingRedirectGuard - token:', auth.getToken());

  // Check if user is logged in
  if (auth.isLoggedIn()) {
    const role = auth.getUserRole();
    console.log('landingRedirectGuard - User logged in with role:', role);
    
    if (role === 'Vendor') {
      console.log('landingRedirectGuard - Redirecting to vendor dashboard');
      router.navigate(['/vendor/dashboard']);
      return false;
    } else if (role === 'Client') {
      console.log('landingRedirectGuard - Redirecting to client home');
      router.navigate(['/client']);
      return false;
    }
  }
  
  console.log('landingRedirectGuard - Allowing access to landing page');
  // If not logged in or no valid role, allow access to landing page
  return true;
};
