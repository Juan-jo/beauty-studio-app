import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AppConfigService } from '../../config/app-config.service';
import { UserMe } from '../models/auth.models';
import { Observable, tap } from 'rxjs';
import { PushNotificationService } from '../notifications/push-notification.service';

export type UserRole =
  | 'ROLE_PUBLIC'
  | 'ROLE_CUSTOMER'
  | 'ROLE_EMPLOYEE'
  | 'ROLE_SALON_ADMIN';


export const TOKEN_STORAGE_KEY = 'bs_last_pushed_fcm_token';
export const hasSeenBookingTooltip = 'hasSeenBookingTooltip';


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

  private readonly pushNotificationService = inject(PushNotificationService)


  public accessToken = signal<string | null>(null);


  private currentRolesSignal = signal<UserRole[]>(['ROLE_PUBLIC']);

  private currentUserSignal = signal<UserMe | null>(null);
  
  readonly currentUser = this.currentUserSignal.asReadonly();


  login(data: any) {
    return this.http.post<{token: string}>(`${this.appConfig.apiUrl}/api/v1/auth/login`, data, {withCredentials: true})
    .pipe(
      tap((response) => {

        this.setToken(response.token);
        
      })
    );

  }

  refresh(): Observable<any> {
    return this.http.post<any>(`${this.appConfig.apiUrl}/api/v1/auth/refresh`, {}, { withCredentials: true })
    .pipe(
      tap((response) => {

        this.setToken(response.token);
        
      })
    );
  }

  register(data: any) {
    return this.http.post<{token: string}>(`${this.appConfig.apiUrl}/api/v1/auth/register`, data, {withCredentials: true})
    .pipe(
      tap((response) => {

        this.setToken(response.token);
        
      })
    );

  }

  setToken(token: string) {

    const payload = jwtDecode<JwtPayload>(token);

    this.setRoles(payload.roles);

    this.accessToken.set(token);

  }

  logout(): Observable<any> {
    return this.http.post(`${this.appConfig.apiUrl}/api/v1/auth/logout`, {}, { withCredentials: true })
    .pipe(
      tap(() => {
        
        this.setPublicRole();
        
      })
    )
  }


  loadAuthenticatedUser(): Observable<UserMe> {

    return this.me().pipe(
      tap(user => {
  
        this.currentUserSignal.set(user);
  
      })
    );
  
  }

  updatePicture(data: any) {
    return this.http.patch<{pictureUrl:string}>(`${this.appConfig.apiUrl}/api/v1/auth/me/picture`, data);
  }

  getProfile() {
    return this.http.get<any>(`${this.appConfig.apiUrl}/api/v1/auth/profile`);
  }

  updateProfile(data: any) {
    return this.http.patch<any>(`${this.appConfig.apiUrl}/api/v1/auth/profile`, data);
  }

  updatePaswword(data: any) {
    return this.http.patch<any>(`${this.appConfig.apiUrl}/api/v1/auth/update-pwd`, data);
  }

  deleteAccount() {
    return this.http.delete<any>(`${this.appConfig.apiUrl}/api/v1/auth/me`)
    .pipe(
      tap(() => {
        
        this.setPublicRole();
      })
    )
  }


  setPublicRole() {

    localStorage.removeItem(hasSeenBookingTooltip);
    localStorage.removeItem(TOKEN_STORAGE_KEY)

    this.accessToken.set(null);

    this.currentRolesSignal.set(['ROLE_PUBLIC']);
    
  }
  

  me(): Observable<UserMe> {
    return this.http.get<UserMe>(
      `${this.appConfig.apiUrl}/api/v1/auth/me`
    ).pipe(
      tap(user => {
        
        this.currentUserSignal.set(user);
      })
    );
  }



  updateUserProfilePicture(newPictureUrl: string): void {
    // 1. Actualizar la Signal reactiva de Angular
    this.currentUserSignal.update(currentUser => {
      if (!currentUser) return null;

      const updatedUser: UserMe = {
        ...currentUser,
        pictureUrl: newPictureUrl
      };


      return updatedUser;
    });
  }



  isLoggedIn(): boolean {
    return !this.hasRole('ROLE_PUBLIC');
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




  setRoles(roles: UserRole[]): void {
    this.currentRolesSignal.set(
      roles.length ? roles : ['ROLE_PUBLIC']
    );
  }
}