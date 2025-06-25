import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
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
