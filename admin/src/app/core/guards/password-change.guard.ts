import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const passwordChangeGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.me().pipe(
    map(() => auth.requiresPasswordChange()
      ? true
      : router.createUrlTree(['/'])),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
