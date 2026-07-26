import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, inject, provideAppInitializer, LOCALE_ID, importProvidersFrom } from '@angular/core';
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



registerLocaleData(localeEsMx);
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),

    provideAppInitializer(async () => {

      const http = inject(HttpClient);
      const configService = inject(AppConfigService);

      const baseHref =
        document
          .querySelector('base')
          ?.getAttribute('href') ?? '/';


      const config = await firstValueFrom(
        http.get<AppConfig>(
          `${baseHref}config/config.json`
        )
      );



      configService.load(config);

    }),

    provideHttpClient(withInterceptorsFromDi()),


    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    
  
  ],
  
};
