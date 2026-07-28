import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AppConfigService } from '../../config/app-config.service';

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

  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);

  private currentRolesSignal = signal<UserRole[]>(
    this.loadRoles()
  );

  private currentUserNameSignal = signal<string>(
    localStorage.getItem(bs_name) ?? ''
  );

  readonly userName = this.currentUserNameSignal.asReadonly();


  login(data: any) {
    return this.http.post<{token: string}>(`${this.appConfig.apiUrl}/api/v1/auth/login`, data);
  }
  

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