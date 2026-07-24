import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth';


// Usamos 'export const' en lugar de 'export font...'
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as UserRole[];
  const userRole = authService.getRole();

  // Si la ruta permite el rol del usuario, le da acceso
  if (allowedRoles && allowedRoles.includes(userRole)) {
    return true;
  }

  // Si no tiene acceso, redirige a la ruta principal de su rol correspondiente
  return router.createUrlTree([getHomeRouteForRole(userRole)]);
};

export function getHomeRouteForRole(role: UserRole): string {
  switch (role) {
    case 'CUSTOMER':
      return '/customer/dashboard';
    case 'EMPLOYEE':
      return '/employee/agenda';
    case 'SALON_ADMIN':
      return '/admin/dashboard';
    default:
      return '/public';
  }
}