import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';
import { PushNotificationService } from './core/notifications/push-notification.service';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class BeautyApp implements OnInit {

  protected readonly title = signal('beauty-studio-pwa');
  private location = inject(Location);

  private pushService = inject(PushNotificationService);
  private authService = inject(AuthService);

  constructor() {
    this.authService.loadAuthenticatedUser();
  }

  ngOnInit() {
    this.initHardwareBackButton();


    if(this.authService.isLoggedIn()) {

      this.setupAppLifecycleListener();
      this.pushService.fetchUnreadCount();

    }
    
  }

  initHardwareBackButton() {

    App.addListener('backButton', () => {
      
      console.log('-----<window>-------', window)
      console.log('-----<location>-----', window.location)

      if (window.location.pathname === '/' || window.location.pathname === '/employee/agenda') {
        //App.minimizeApp();
        App.exitApp();
      } else {
        this.location.back();
      }
    });

  }

  private setupAppLifecycleListener(): void {
    
    App.addListener('appStateChange', async ({ isActive }) => {
      
      
      if (isActive && Capacitor.isNativePlatform()) {

        if(this.authService.isLoggedIn()) {

          
          this.pushService.fetchUnreadCount();

          this.pushService.initPushNotifications()
          .then(_=> {});
    
        }
        
      }
    });
  }

}


