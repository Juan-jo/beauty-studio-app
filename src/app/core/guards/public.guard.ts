
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { getHomeRouteForRole } from './role.guard';

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si YA está logueado, NO debe poder entrar a rutas públicas/login
  if (authService.isLoggedIn()) {
    const role = authService.getRole();
    // Redirige a su área según su rol
    return router.createUrlTree([getHomeRouteForRole(role)]);
  }

  return true; 
};