import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { PushNotificationService } from '../../core/notifications/push-notification.service';

@Component({
  selector: 'app-employee-layout',
  imports: [RouterOutlet,RouterLink ,RouterLinkActive],
  templateUrl: './employee-layout.layout.html',
  styles: ``,
})
export class EmployeeLayoutLayout implements OnInit {
  
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


  ngOnInit(): void {
    this.notificationService.fetchUnreadCount();
  }
}
