import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AppConfigService } from '../../config/app-config.service';
import { UserMe } from '../models/auth.models';
import { Observable, tap } from 'rxjs';

export type UserRole =
  | 'PUBLIC'
  | 'CUSTOMER'
  | 'EMPLOYEE'
  | 'SALON_ADMIN';

export const bs_roles = 'bs_roles';
export const bs_token = 'bs_token';
export const bs_name = 'bs_name';
export const bs_user = 'bs_user';
export const TOKEN_STORAGE_KEY = 'bs_last_pushed_fcm_token';


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

  private currentUserSignal = signal<UserMe | null>(
    this.loadUser()
  );
  

  readonly currentUser = this.currentUserSignal.asReadonly();
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

  loadAuthenticatedUser(): Observable<UserMe> {

    return this.me().pipe(
      tap(user => {
  
        this.currentUserSignal.set(user);
  
        localStorage.setItem(
          bs_user,
          JSON.stringify(user)
        );
  
      })
    );
  
  }

  updatePicture(data: any) {
    return this.http.patch<{pictureUrl:string}>(`${this.appConfig.apiUrl}/api/v1/auth/me/picture`, data);
  }
  

  me(): Observable<UserMe> {
    return this.http.get<UserMe>(
      `${this.appConfig.apiUrl}/api/v1/auth/me`
    ).pipe(
      tap(user => {
        
        localStorage.setItem(
          bs_user,
          JSON.stringify(user)
        );

        this.currentUserSignal.set(user);
      })
    );
  }

  private loadUser(): UserMe | null {

    const value = localStorage.getItem(bs_user);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }


  updateUserProfilePicture(newPictureUrl: string): void {
    // 1. Actualizar la Signal reactiva de Angular
    this.currentUserSignal.update(currentUser => {
      if (!currentUser) return null;

      const updatedUser: UserMe = {
        ...currentUser,
        pictureUrl: newPictureUrl
      };

      // 2. Guardar la versión actualizada en LocalStorage
      localStorage.setItem(bs_user, JSON.stringify(updatedUser));

      return updatedUser;
    });
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