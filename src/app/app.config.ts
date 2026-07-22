import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppConfigService } from './config/app-config.service';
import { AppConfig } from './config/app-config.model';

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

    })
  ]
};
