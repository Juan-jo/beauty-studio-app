import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import { OpenDialogService } from '../../shared/dialog/open-dialog';
import { CusBookingsDialog } from '../../features/customer/components/cus-bookings-dialog/cus-bookings-dialog';
import { AuthService } from '../../core/services/auth';
import { PushNotificationService } from '../../core/notifications/push-notification.service';
import { UserUpdatePictureComponent } from '../../shared/components/user-update-picture/user-update-picture';
import { CustomerBookingService } from '../../features/customer/service/cus-booking';
import { CusNotificationsDialog } from '../../features/customer/components/cus-notifications-dialog/cus-notifications-dialog';
import { AppConfigService } from '../../config/app-config.service';

@Component({
  selector: 'app-customer-layout',
  imports: [
    RouterOutlet,
    RouterLink
],
  templateUrl: './customer-layout.layout.html',
  styles: ``,
})
export class CustomerLayoutLayout implements OnInit {

  protected notificationService = inject(PushNotificationService);
  protected customerBookingService = inject(CustomerBookingService);
  
  readonly config = inject(AppConfigService);

  

  private readonly openDialogService = inject(OpenDialogService);
  private readonly authService = inject(AuthService);

  user = this.authService.currentUser;

  userInitials = computed(() => {

    const name = this.user()?.name;

    if (!name) {
      return '';
    }

    return name
      .trim()
      .split(' ')
      .slice(0, 1 )
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();

  });
  

  openDialogBookings() {

    this.openDialogService.open<null, null>(CusBookingsDialog, {
      updateUrl: true
    })
    .then(_ => {});

  }

  openNotifications() {

    this.openDialogService.open<null, null>(CusNotificationsDialog, {
      updateUrl: true
    })
    .then(_ => {});

  }

  

  uploadPicture() {

    this.openDialogService.open<null, null>(UserUpdatePictureComponent, {})
    .then(_ => {});

  }


  ngOnInit(): void {
    this.notificationService.fetchUnreadCount();
    this.customerBookingService.fetchCountActiveBookings();

  }

  dismissBookingTooltip() {
    this.customerBookingService.dismissBookingTooltip();
  }
  
}
