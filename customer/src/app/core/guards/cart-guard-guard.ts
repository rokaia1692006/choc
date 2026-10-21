import { CanActivateFn ,Router} from '@angular/router';
import { inject } from '@angular/core';
import { CartService } from '../services/cart';

export const cartGuardGuard: CanActivateFn = (route, state) => {
  const cart = inject(CartService);
  const router = inject(Router);

  if (cart.getitems().length > 0) return true;
  router.navigate(['shop']);
  return false;
};
