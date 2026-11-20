import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AdminRole } from '../models/user.model';

export const roleGuard = (...roles: AdminRole[]): CanActivateFn => () => {
  const user = inject(AuthService).user();
  const router = inject(Router);
  return user && roles.includes(user.role) ? true : router.createUrlTree(['/orders']);
};