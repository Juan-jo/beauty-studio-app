
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.beautystudio.brens.mobile',
  appName: 'Brens Studio',
  webDir: 'dist/beauty-studio-pwa/browser',
  
  server: {
    androidScheme: 'http',  // Asegura el comportamiento con CORS
    cleartext: true         // Permite peticiones http no seguras
  },


  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert", "banner", "list"],
    },

    CapacitorHttp: {
      enabled: true
    },
  },

};

export default config;