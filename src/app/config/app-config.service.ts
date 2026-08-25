import { Injectable } from '@angular/core';
import { AppConfig } from './app-config.model';


@Injectable({
  providedIn: 'root'
})
export class AppConfigService {


  private config!: AppConfig;


  load(config: AppConfig) {

    this.config = config;

    document.documentElement.setAttribute('data-theme', config.theme);
  }


  get apiUrl(): string {

    return this.config.apiUrl;

  }


  get salonSerial(): string {

    return this.config.salonSerial;

  }


  get production(): boolean {

    return this.config.production;

  }


  get theme(): string {

    return this.config.theme;

  }

  get currency(): string {

    return this.config.currency;

  }

  get timezone(): string {

    return this.config.timezone;

  }

  get logo(): string {

    return this.config.logo;
  }

  get salonName(): string {

    return this.config.salonName;
  }
  

  setTheme(theme: string) {
    if (this.config) {
      this.config.theme = theme;
    }
    document.documentElement.setAttribute('data-theme', theme);
  }

}