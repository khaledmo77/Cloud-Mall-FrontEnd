import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, timer } from 'rxjs';

export interface TokenPayload {
  sub: string;
  jti: string;
  email: string;
  id: string;
  role: string;
  nbf: number;
  exp: number;
  iat: number;
  iss: string;
  aud: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  
  // Observable to track authentication state
  private authStateSubject = new BehaviorSubject<boolean>(false);
  public authState$ = this.authStateSubject.asObservable();
  
  // Timer for token expiration
  private expirationTimer: any = null;

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
    const isLoggedIn = !!token && !this.isTokenExpired(token);
    console.log('AuthService.isLoggedIn() - token:', token, 'isLoggedIn:', isLoggedIn);
    
    // Update auth state
    this.authStateSubject.next(isLoggedIn);
    
    return isLoggedIn;
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < currentTime;
      
      console.log('Token expiration check:', {
        currentTime,
        expirationTime: payload.exp,
        isExpired,
        timeUntilExpiry: payload.exp - currentTime,
        tokenAge: currentTime - payload.iat
      });
      
      return isExpired;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true; // Consider expired if we can't parse it
    }
  }

  decodeToken(token: string): TokenPayload {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Invalid token format');
    }
  }

  getTokenExpirationTime(): number | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = this.decodeToken(token);
      return payload.exp;
    } catch (error) {
      return null;
    }
  }

  getTimeUntilExpiration(): number {
    const expirationTime = this.getTokenExpirationTime();
    if (!expirationTime) return 0;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return Math.max(0, expirationTime - currentTime);
  }

  // Set up automatic logout when token expires
  setupTokenExpirationCheck(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const token = this.getToken();
    if (!token) return;
    
    const timeUntilExpiry = this.getTimeUntilExpiration();
    
    if (timeUntilExpiry <= 0) {
      // Token is already expired
      this.handleTokenExpiration();
      return;
    }
    
    // Clear existing timer
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }
    
    // Set timer for token expiration (with 30 second buffer)
    const timerDuration = Math.max(0, (timeUntilExpiry - 30) * 1000);
    
    console.log(`Setting up token expiration timer for ${timerDuration}ms (${timeUntilExpiry}s until expiry)`);
    
    this.expirationTimer = setTimeout(() => {
      console.log('Token expiration timer triggered');
      this.handleTokenExpiration();
    }, timerDuration);
  }

  handleTokenExpiration(): void {
    console.log('Handling token expiration - logging out user');
    this.logout();
    
    // Show notification to user
    if (isPlatformBrowser(this.platformId)) {
      alert('Your session has expired. Please log in again.');
    }
    
    // Redirect to landing page
    this.router.navigate(['/landing']);
  }

  // Force logout (for manual logout or security issues)
  forceLogout(): void {
    console.log('Force logout called');
    this.logout();
    this.router.navigate(['/landing']);
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
    
    // Clear expiration timer
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }
    
    // Update auth state
    this.authStateSubject.next(false);
    
    console.log('User logged out successfully');
  }

  // Store authentication data and set up expiration check
  setAuthData(authData: {
    token: string;
    role: string;
    userId: string;
    name: string;
    email: string;
  }): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem('token', authData.token);
      storage.setItem('role', authData.role);
      storage.setItem('userId', authData.userId);
      storage.setItem('name', authData.name);
      storage.setItem('email', authData.email);
    }
    
    // Update auth state
    this.authStateSubject.next(true);
    
    // Set up expiration check
    this.setupTokenExpirationCheck();
    
    console.log('Authentication data stored and expiration check set up');
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

  // Check if token will expire soon (within 5 minutes)
  isTokenExpiringSoon(): boolean {
    const timeUntilExpiry = this.getTimeUntilExpiration();
    return timeUntilExpiry > 0 && timeUntilExpiry < 300; // 5 minutes
  }

  // Get token info for debugging
  getTokenInfo(): any {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = this.decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000);
      
      return {
        issuedAt: new Date(payload.iat * 1000).toLocaleString(),
        expiresAt: new Date(payload.exp * 1000).toLocaleString(),
        timeUntilExpiry: payload.exp - currentTime,
        role: payload.role,
        email: payload.email,
        userId: payload.id
      };
    } catch (error) {
      return { error: 'Invalid token' };
    }
  }
}
