import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip adding token for login and vendor setup endpoints
  const skipUrls = ['/api/Auth/login', '/api/Auth/submit-vendor-details'];
  const shouldSkip = skipUrls.some(url => req.url.includes(url));
  
  if (shouldSkip) {
    return next(req);
  }

  const token = authService.getToken();
  
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};
