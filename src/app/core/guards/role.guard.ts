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


  if(roles.includes('ROLE_EMPLOYEE') || roles.includes('ROLE_SALON_ADMIN')) {
    return '/employee/agenda';
  }
  else if(roles.includes('ROLE_CUSTOMER')) {
    return '/customer/feed';
  }

  return '/public';

}