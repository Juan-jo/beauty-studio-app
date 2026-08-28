import { Component, inject, OnInit, signal } from '@angular/core';
import { PushNotificationService } from '../../../core/notifications/push-notification.service';
import { PushNotifications } from '@capacitor/push-notifications';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { NativeSettings, AndroidSettings, IOSSettings } from 'capacitor-native-settings';

@Component({
  selector: 'app-enabled-push-notifications',
  imports: [],
  templateUrl: './enabled-push-notifications.html'
})
export class EnabledPushNotifications implements OnInit {


  protected notificationService = inject(PushNotificationService);


  permissionStatus = signal<PermissionState>('prompt');

  constructor() {
    this.checkPermissions();
  }

  ngOnInit(): void {
    App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {

          this.checkPermissions();
        }
      });
}

  async checkPermissions() {

    if (!Capacitor.isNativePlatform()) {
      return
    }
    try {
      
      const status = await PushNotifications.checkPermissions();
      
  

      if(status.receive === 'granted') {
        this.permissionStatus.set('granted');
      }
      else {
        this.permissionStatus.set('denied');
      }
      
      this.notificationService.setEnabledNotification(status.receive === 'granted');

    } catch (error) {
      console.error('Error al comprobar permisos:', error);
    }
  }

  
  async requestOrOpenSettings() {
    const currentStatus = this.permissionStatus();

    if (currentStatus === 'prompt') {
      
      const result = await PushNotifications.requestPermissions();
      
      if(result.receive === 'granted') {
        this.permissionStatus.set('granted');
      }
      else {
        this.permissionStatus.set('denied');
      }

      
      if (result.receive === 'granted') {
        this.notificationService.setEnabledNotification(true);
        await PushNotifications.register();
      }
    } else if (currentStatus === 'denied') {
      
      await this.openAppSettings();
    }
  }

  
  private openAppSettings() {
    try {

      NativeSettings.open({
        optionAndroid: AndroidSettings.ApplicationDetails, 
        optionIOS: IOSSettings.App,

      });
      
    } catch (error) {
      console.error('Error al abrir la configuración:', error);
    }
  }
  
  
}
