import { Component, computed, inject } from '@angular/core';
import { SectionLogout } from '../../../shared/components/section-logout/section-logout';
import { SectionTheme } from '../../../shared/components/section-theme/section-theme';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../core/services/auth';
import { EmployeeAuthenticatedService } from '../service/empl-authenticated.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DurationPipe } from '../../../core/pipes/duration-pipe';
import { HasRoleDirective } from '../../../core/directives/has-role';
import { OpenDialogService } from '../../../shared/dialog/open-dialog';
import { UserUpdatePictureComponent } from '../../../shared/components/user-update-picture/user-update-picture';
import { EnabledPushNotifications } from '../../../shared/components/enabled-push-notifications/enabled-push-notifications';

@Component({
  selector: 'app-empl-profile',
  imports: [
    SectionLogout,
    SectionTheme,
    RouterLink,
    DurationPipe,
    HasRoleDirective,
    EnabledPushNotifications
],
  templateUrl: './empl-profile.html',
  styleUrl: './empl-profile.css',
})
export class EmplProfile {

  private readonly employeeAuthenticatedService = inject(EmployeeAuthenticatedService);
  private readonly authService = inject(AuthService);

  private readonly openDialogService = inject(OpenDialogService);


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


  meResource = rxResource<EmployeeMe, void>({
    stream: () => this.employeeAuthenticatedService.meAuthenticated()
  });


  updatePicture() {
    this.openDialogService.open<null, null>(UserUpdatePictureComponent, {})
    .then(response => {});
  }
}


export interface EmployeeMe {
  email             : string
  phone             : string
  salonName         : string
  activeServices    : string
  workingHours      : string
}