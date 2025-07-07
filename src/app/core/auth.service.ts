import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private getStorage(): Storage | null {
    return isPlatformBrowser(this.platformId) ? localStorage : null;
  }

  getToken(): string | null {
    const storage = this.getStorage();
    return storage ? storage.getItem('token') : null;
  }

  getUserRole(): string | null {
    const storage = this.getStorage();
    const role = storage ? storage.getItem('role') : null;
    console.log('AuthService.getUserRole() - storage:', storage, 'role:', role);
    return role;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const isLoggedIn = !!token;
    console.log('AuthService.isLoggedIn() - token:', token, 'isLoggedIn:', isLoggedIn);
    return isLoggedIn;
  }

  logout(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem('token');
      storage.removeItem('role');
      storage.removeItem('userId');
      storage.removeItem('name');
      storage.removeItem('email');
    }
  }

  getDefaultRoute(): string {
    if (!this.isLoggedIn()) {
      return '/landing';
    }
    
    const role = this.getUserRole();
    switch (role) {
      case 'Vendor':
        return '/vendor';
      case 'Client':
        return '/client';
      default:
        return '/landing';
    }
  }
}
