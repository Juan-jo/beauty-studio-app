import { Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export type UserRole =
  | 'PUBLIC'
  | 'CUSTOMER'
  | 'EMPLOYEE'
  | 'SALON_ADMIN';

export const bs_roles = 'bs_roles';
export const bs_token = 'bs_token';
export const bs_name = 'bs_name';

interface JwtPayload {
  roles: UserRole[];
  name: string;
  userId: number;
  salonId: number;
  exp: number;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentRolesSignal = signal<UserRole[]>(
    this.loadRoles()
  );

  private currentUserNameSignal = signal<string>(
    localStorage.getItem(bs_name) ?? ''
  );

  readonly userName = this.currentUserNameSignal.asReadonly();


  //readonly currentRoles = this.currentRolesSignal.asReadonly();

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

  saveToken(token: string): void {

    const payload = jwtDecode<JwtPayload>(token);
    
    localStorage.setItem(bs_token, token);
    localStorage.setItem(bs_name, payload.name);
    localStorage.setItem(bs_roles, JSON.stringify(payload.roles));

    this.currentUserNameSignal.set(payload.name)
    this.setRoles(payload.roles);

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