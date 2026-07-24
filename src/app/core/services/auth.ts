
import { Injectable, signal } from '@angular/core';

export type UserRole = 'PUBLIC' | 'CUSTOMER' | 'EMPLOYEE' | 'SALON_ADMIN';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Simulamos el usuario logueado usando Signals (Angular Moderno)
  // Cambia este valor inicial para probar otros roles: 'CUSTOMER' | 'EMPLOYEE' | 'SALON_ADMIN' | 'PUBLIC'
  private currentRoleSignal = signal<UserRole>('PUBLIC');

  // Signal pública de lectura
  readonly currentRole = this.currentRoleSignal.asReadonly();

  // Simula si el usuario tiene token de sesión activo
  isLoggedIn(): boolean {
    return this.currentRoleSignal() !== 'PUBLIC';
  }

  // Permite obtener el rol actual de forma síncrona
  getRole(): UserRole {
    return this.currentRoleSignal();
  }

  // Método para cambiar de rol dinámicamente (Útil para un switcher de testing)
  setRole(role: UserRole): void {
    this.currentRoleSignal.set(role);
  }
}