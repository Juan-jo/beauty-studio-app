
import { Injectable, signal } from '@angular/core';

export type UserRole = 'PUBLIC' | 'CUSTOMER' | 'EMPLOYEE' | 'SALON_ADMIN';

export const bs_role = 'bs_role';
export const bs_token = 'bs_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  
  //private currentRoleSignal = signal<UserRole>('EMPLOYEE');
  
  private currentRoleSignal = signal<UserRole>(
    localStorage.getItem(bs_role) as UserRole ?? 'PUBLIC'
  );

  
  readonly currentRole = this.currentRoleSignal.asReadonly();

  
  isLoggedIn(): boolean {
    return this.currentRoleSignal() !== 'PUBLIC';
  }

  
  getRole(): UserRole {
    return this.currentRoleSignal();
  }

  saveLogin(token: string, role: UserRole) {
    localStorage.setItem(bs_token, token);
    localStorage.setItem(bs_role, role);
    this.setRole(role)
  }

  logout() {
    localStorage.removeItem(bs_token);
    localStorage.removeItem(bs_role);
    this.setRole('PUBLIC')
  }
  
  setRole(role: UserRole): void {
    this.currentRoleSignal.set(role);
  }
}