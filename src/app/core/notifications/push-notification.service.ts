import { computed, inject, Injectable, signal } from '@angular/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TOKEN_STORAGE_KEY } from '../services/auth';
import { AppConfigService } from '../../config/app-config.service';

@Injectable({
  providedIn: 'root'
})

export class PushNotificationService {
    
    private isListenersRegistered = false;
    private readonly appConfig = inject(AppConfigService);

  
    private unreadCountSignal = signal<number>(0);

    // Computados expuestos para la interfaz
    readonly unreadCount = this.unreadCountSignal.asReadonly();
    readonly hasUnread = computed(() => this.unreadCountSignal() > 0);



    constructor(private http: HttpClient) {
        
    }
  
    
    public async initPushNotifications(): Promise<void> {
        
        if (!Capacitor.isNativePlatform()) {
            console.warn('Push notifications son para plataformas nativas');
            return;
        }
    
        
        if (!this.isListenersRegistered) {
            this.registerListeners();
            this.isListenersRegistered = true;
        }
    
        await this.registerPush();

    }
  
    private async registerPush(): Promise<void> {
      
        
        let permStatus = await PushNotifications.checkPermissions();
  
        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }
    
        if (permStatus.receive !== 'granted') {
            console.error('Permiso para push notifications denegado.');
            return;
        }
    
        
        await this.createHighPriorityChannel();
        
        await PushNotifications.register();
    }
  
    
    // listeners de eventos PushNotifications
    private registerListeners(): void {
      
        
        PushNotifications.addListener('registration', async (token: Token) => {
            
            console.log('FCM Token recibido:', token.value);
            
            const lastSavedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
            
            
            if (lastSavedToken === token.value) {
                console.log('El token de notificaciones no ha cambiado. Se omite el envío al backend.');
                return;
            }
        
              
            await this.sendTokenToBackend(token.value);
            
        });
    
        // Capturar errores de registro
        PushNotifications.addListener('registrationError', (error: any) => {
            console.error('Error en el registro de Push:', JSON.stringify(error));
        });
    
        // Escuchar notificación recibida cuando la App está abierta (Foreground)
        PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
            console.log('Notificación recibida en primer plano:', notification);
            this.unreadCountSignal.update(count => count + 1);
        });
    
        // Escuchar cuando el usuario hace clic en la notificación
        PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
            console.log('Acción realizada sobre la notificación:', notification);
            this.fetchUnreadCount();
            
        });
    }
  
   
  
    
    private async sendTokenToBackend(token: string): Promise<void> {

        console.log('Enviando Token al backend...');

        const payload = {
            token: token,
            platform: Capacitor.getPlatform().toUpperCase() // 'android' o 'ios'
        };
    
        try {
            
            await firstValueFrom(this.http.post<void>(`${this.appConfig.apiUrl}/api/v1/notification/register`, payload))

            localStorage.setItem(TOKEN_STORAGE_KEY, token);


            console.log('Token enviado exitosamente al backend');
        } catch (error) {
            console.error('Error al enviar el token al backend:', error);
        }
    }
  
    
    
    private async createHighPriorityChannel(): Promise<void> {
      
        if (Capacitor.getPlatform() === 'android') {
            
            await PushNotifications.createChannel({

                id: 'high_importance_channel',
                name: 'Notificaciones Importantes',
                description: 'Canal para notificaciones emergentes de alta prioridad',
                importance: 5, // IMPORTANCE_HIGH (muestra banner y suena)
                visibility: 1, // VISIBILITY_PUBLIC (visible en pantalla de bloqueo)
                sound: 'default',
                vibration: true
            
            });
      }

    }
  
    
    public async unregisterDeviceToken(): Promise<void> {
      if (Capacitor.isNativePlatform()) {
        try {
            
            const lastSavedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

            const payload = {
                token: lastSavedToken
            };
        

          await firstValueFrom(this.http.patch<void>(`${this.appConfig.apiUrl}/api/v1/notification/unregister`, payload))


          console.log('Token eliminado del backend.');
        } catch (error) {
          console.error('Error al eliminar token del backend:', error);
        }
      }
      
    }



    fetchUnreadCount(): void {

        console.log("--< fetching push notification >--")
        this.http.get<{ unreadCount: number }>(`${this.appConfig.apiUrl}/api/v1/notification/unread-count`).subscribe({
        next: (res) => this.unreadCountSignal.set(res.unreadCount),
        error: (err) => console.error('Error al obtener notificaciones no leídas', err)
        });
    }

    
    markAllAsRead(): void {
        if (this.unreadCountSignal() === 0) return;

        this.http.patch(`${this.appConfig.apiUrl}/api/v1/notification/mark-as-read`, {}).subscribe({
        next: () => this.unreadCountSignal.set(0),
        error: (err) => console.error('Error al marcar notificaciones como leídas', err)
        });
    }
  }
