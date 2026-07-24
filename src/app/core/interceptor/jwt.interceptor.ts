import { Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import { catchError, Observable, throwError} from 'rxjs';
import { bs_token } from '../services/auth';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = localStorage.getItem(bs_token)

    if (token && req.url.indexOf('/public') == -1) {
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          //return this.handle401Error(req, next);
        }
        
        return throwError(() => error.error);
      })
    );
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { 
      Authorization: `Bearer ${token}` ,
      'Content-Type': 'application/json',

    } });
  }


}
