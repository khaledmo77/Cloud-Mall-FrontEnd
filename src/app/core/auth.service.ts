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
    return storage ? storage.getItem('role') : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
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
}
