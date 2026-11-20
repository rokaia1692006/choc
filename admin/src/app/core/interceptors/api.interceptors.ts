import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../api.config';
import { AuthService } from '../services/auth.service';

export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const isApi = req.url.startsWith(API_URL);
  const request = isApi
    ? req.clone({ withCredentials: true, setHeaders: { 'X-Requested-With': 'choc-admin' } })
    : req;

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      const skip = ['/auth/login', '/auth/2fa', '/auth/email/verify', '/auth/me'].some(p => req.url.includes(p));
      if (isApi && err.status === 401 && !skip) {
        auth.user.set(null);
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};