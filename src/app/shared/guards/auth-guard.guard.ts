import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { inject } from '@angular/core';
import { Session } from '../utils/session';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const session: Session = inject(Session);
  const router: Router = inject(Router);
  const protectedRoutes1: string[] = ['/home'];
  const protectedRoutes2: string[] = ['/dashboard','/dashboard/profile','/dashboard/users'];
  return protectedRoutes2.includes(state.url) && !session.getToken()
    ? router.navigate(['/home'])
    : protectedRoutes1.includes(state.url) && session.getToken()
    ? router.navigate(['/dashboard'])
    : true
};
