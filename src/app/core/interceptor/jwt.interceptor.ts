import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, finalize, Observable, retry, switchMap, take, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { getHomeRouteForRole } from '../guards/role.guard';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private isRefreshing = false;

  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    let authReq = req.clone({
      withCredentials: true
    });

    const token = this.authService.accessToken();

    const isAuthRequest =
      req.url.includes('/auth/login') ||
      req.url.includes('/auth/refresh') ||
      req.url.includes('/auth/logout');

    if (token && !isAuthRequest) {
      authReq = this.addToken(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        
        if (error.status === 401 && !isAuthRequest) {
          return this.handle401Error(req, next);
        }

        const customError = {
          status: error.status,
          code: error.error?.code,
          violation: error.error?.violation,
          raw: error
        };
  
        return throwError(() => customError);

      })
    );
  }


  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Esta petición espera el nuevo token.
    if (this.isRefreshing) {

      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {

          return next.handle(
            this.addToken(req, token!)
          );

        })
      );
    }


    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.authService.refresh().pipe(

      tap(response => {
        
        this.refreshTokenSubject.next(response.token);
      }),

      switchMap(response => {

        return next.handle(
          this.addToken(req, response.token)
        );

      }),

      catchError(error => {

        this.refreshTokenSubject.next(null);
       
        this.authService.logout().subscribe(_=> {

          this.router.navigate(
            [
              getHomeRouteForRole(
                ['ROLE_PUBLIC']
              )
            ],
            {
              replaceUrl: true
            }
          );


        });
        

        return throwError(() => error);

      }),

      finalize(() => {

        this.isRefreshing = false;

      })
    );
  }


  private addToken(
    req: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {

    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
  }
}
