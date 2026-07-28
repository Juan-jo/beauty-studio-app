import { Component, inject } from '@angular/core';
import { SectionLogout } from '../../../shared/components/section-logout/section-logout';
import { SectionTheme } from '../../../shared/components/section-theme/section-theme';
import { EmplServices } from '../components/empl-services/empl-services';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-empl-profile',
  imports: [
    SectionLogout,
    SectionTheme,
    EmplServices,
    RouterLink,
    
],
  templateUrl: './empl-profile.html',
  styleUrl: './empl-profile.css',
})
export class EmplProfile {

  private readonly auth = inject(AuthService);

  isOpenModalService = false;

  get username() {
    return this.auth.userName;
  }

  closeModalService() {
    this.isOpenModalService = false
  }

}
