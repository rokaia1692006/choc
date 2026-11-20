import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.user()) {
    return auth.requiresPasswordChange()
      ? router.createUrlTree(['/change-password'])
      : true;
  }
  return auth.me().pipe(
    map(() => auth.requiresPasswordChange()
      ? router.createUrlTree(['/change-password'])
      : true),
    catchError(() => of(router.createUrlTree(['/login'])))
  );
};