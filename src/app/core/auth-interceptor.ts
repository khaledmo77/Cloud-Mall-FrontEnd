import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);
  const router = inject(Router);
  
  let token: string | null = null;
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('token');
  }
  
  console.log('AuthInterceptor - URL:', req.url);
  console.log('AuthInterceptor - Token exists:', !!token);
  console.log('AuthInterceptor - Token:', token ? token.substring(0, 50) + '...' : 'null');
  
  // Skip adding auth headers for static asset requests
  if (req.url.includes('/assets/')) {
    return next(req);
  }

  if (token) {
    // Check if token is expired before making request
    if (authService.isTokenExpired(token)) {
      console.warn('AuthInterceptor - Token is expired, redirecting to login');
      authService.handleTokenExpiration();
      return throwError(() => new Error('Token expired'));
    }
    
    // For FormData requests, don't set Content-Type as browser needs to set it with boundary
    const headers: any = { Authorization: `Bearer ${token}` };
    
    // Only set Content-Type for non-FormData requests
    if (!(req.body instanceof FormData)) {
      headers['Content-Type'] = req.headers.get('Content-Type') || 'application/json';
    }
    
    req = req.clone({ setHeaders: headers });
    console.log('AuthInterceptor - Headers set:', req.headers);
  } else {
    console.warn('AuthInterceptor - No token found for request:', req.url);
  }
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('AuthInterceptor - Request failed:', error);
      
      if (error.status === 401) {
        console.warn('AuthInterceptor - 401 Unauthorized, token might be expired');
        
        // Handle token expiration
        if (isPlatformBrowser(platformId)) {
          authService.handleTokenExpiration();
        }
        
        return throwError(() => new Error('Authentication failed. Please log in again.'));
      }
      
      return throwError(() => error);
    })
  );
};
