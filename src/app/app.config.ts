import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, inject, provideAppInitializer, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppConfigService } from './config/app-config.service';
import { AppConfig } from './config/app-config.model';
import { JwtInterceptor } from './core/interceptor/jwt.interceptor';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import { AuthService } from './core/services/auth';
import { Router } from '@angular/router';
import { getHomeRouteForRole } from './core/guards/role.guard';


registerLocaleData(localeEsMx);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
      enabled: false
      //enabled: !isDevMode(),
      //registrationStrategy: 'registerWhenStable:30000'
    }),

    provideAppInitializer(async () => {

      const http = inject(HttpClient);
      const configService = inject(AppConfigService);
      const authService = inject(AuthService);
      const router = inject(Router);


      const baseHref =
        document
          .querySelector('base')
          ?.getAttribute('href') ?? '/';


      try {
        const config = await firstValueFrom(
          http.get<AppConfig>(
            `${baseHref}config/config.json`
          )
        );

        configService.load(config);

        await firstValueFrom(authService.refresh())
        .then(async _ => {

          
          await firstValueFrom(
            authService.loadAuthenticatedUser()
          );

        })
        
        .catch((err) => {
          
          

          router.navigate(
            [
              getHomeRouteForRole(
                ['ROLE_PUBLIC']
              )
            ],
            {
              replaceUrl: true
            }
          );
          
          
          return null;
        });

        
        
      }
      catch (err) {
        console.error('Error durante la inicialización de la app:', err);
      }
      

    }),

    provideHttpClient(withInterceptorsFromDi()),


    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    
    { provide: LOCALE_ID, useValue: 'es-MX' }


  
  ],
  
};


