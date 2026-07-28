import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth';



export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as UserRole[];


  if(authService.hasRoles(allowedRoles)) {
    return true;
  }
  
  return router.createUrlTree([getHomeRouteForRole(allowedRoles)]);
};

export function getHomeRouteForRole(roles: UserRole[]): string {

  if(roles.includes('EMPLOYEE') || roles.includes('SALON_ADMIN')) {
    return '/employee/agenda';
  }
  else if(roles.includes('CUSTOMER')) {
    return '/customer/feed';
  }

  return '/public';

}