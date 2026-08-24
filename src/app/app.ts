import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';
import { PushNotificationService } from './core/notifications/push-notification.service';
import { Capacitor } from '@capacitor/core';
import { OpenDialogService } from './shared/dialog/open-dialog';

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

  private readonly openDialogService = inject(OpenDialogService);

  ngOnInit() {

    this.initHardwareBackButton();


    if(this.authService.isLoggedIn()) {

      this.setupAppLifecycleListener();
      
      this.authService.loadAuthenticatedUser()
      .subscribe();
      
    }
    
  }

  initHardwareBackButton() {

    App.addListener('backButton', () => {
  
      // Hay un modal abierto
      if (this.openDialogService.hasOpenModals()) {
  
        this.openDialogService.closeTopModal();
  
        return;
      }
  
      // No hay modal
      const pathname = window.location.pathname;
  
      if (
        pathname === '/' ||
        pathname === '/employee/agenda' ||
        pathname === '/customer/feed'
      ) {
        App.exitApp();
        return;
      }
  
      this.location.back();
  
    });
  
  }
  

  private setupAppLifecycleListener(): void {
    
    App.addListener('appStateChange', async ({ isActive }) => {
      
      
      if (isActive && Capacitor.isNativePlatform()) {

        if(this.authService.isLoggedIn()) {

          this.pushService.initPushNotifications()
          .then(_=> {});
    
        }
        
      }
    });
  }

}


