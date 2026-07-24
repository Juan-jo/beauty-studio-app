
export type ThemeType = 'pink' | 'violet' | 'emerald';

export interface AppConfig {

    apiUrl: string;
  
    salonSerial: string;
  
    production: boolean;
  
    timezone: string,

    currency: string,

    theme: string  }