import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { PushNotificationService } from '../../core/notifications/push-notification.service';

@Component({
  selector: 'app-employee-layout',
  imports: [RouterOutlet,RouterLink ,RouterLinkActive],
  templateUrl: './employee-layout.layout.html',
  styles: ``,
})
export class EmployeeLayoutLayout {


  private readonly authService = inject(AuthService);
  protected notificationService = inject(PushNotificationService);

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


}
