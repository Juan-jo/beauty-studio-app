import { Injectable, signal } from '@angular/core';

export type UserRole =
  | 'PUBLIC'
  | 'CUSTOMER'
  | 'EMPLOYEE'
  | 'SALON_ADMIN';

export const bs_roles = 'bs_roles';
export const bs_token = 'bs_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentRolesSignal = signal<UserRole[]>(
    this.loadRoles()
  );

  readonly currentRoles = this.currentRolesSignal.asReadonly();

  private loadRoles(): UserRole[] {
    const value = localStorage.getItem(bs_roles);

    if (!value) {
      return ['PUBLIC'];
    }

    try {
      return JSON.parse(value) as UserRole[];
    } catch {
      return ['PUBLIC'];
    }
  }

  isLoggedIn(): boolean {
    return !this.hasRole('PUBLIC');
  }

  getRoles(): UserRole[] {
    return this.currentRolesSignal();
  }

  hasRole(role: UserRole): boolean {
    return this.currentRolesSignal().includes(role);
  }

  hasAnyRole(...roles: UserRole[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  hasRoles(roles: UserRole[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  saveToken(token: string, roles: UserRole[]): void {
    localStorage.setItem(bs_token, token);
    localStorage.setItem(bs_roles, JSON.stringify(roles));

    this.setRoles(roles);
  }

  logout(): void {
    localStorage.removeItem(bs_token);
    localStorage.removeItem(bs_roles);

    this.setRoles(['PUBLIC']);
  }

  setRoles(roles: UserRole[]): void {
    this.currentRolesSignal.set(
      roles.length ? roles : ['PUBLIC']
    );
  }
}