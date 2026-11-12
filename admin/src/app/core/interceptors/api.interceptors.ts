import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../api.config';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const isApi = req.url.startsWith(API_URL);

  const request = isApi
    ? req.clone({ withCredentials: true, setHeaders: { 'X-Requested-With': 'choc-admin' } })
    : req;

  return next(request).pipe(
    catchError(err => {
      const isAuthCall = req.url.includes('/auth/login') || req.url.includes('/auth/2fa');
      if (isApi && err.status === 401 && !isAuthCall) router.navigate(['/login']);
      return throwError(() => err);
    })
  );
};