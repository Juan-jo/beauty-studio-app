import { Component, computed, inject } from '@angular/core';
import { SectionLogout } from '../../../shared/components/section-logout/section-logout';
import { SectionTheme } from '../../../shared/components/section-theme/section-theme';
import { AuthService } from '../../../core/services/auth';
import { OpenDialogService } from '../../../shared/dialog/open-dialog';
import { UserUpdatePictureComponent } from '../../../shared/components/user-update-picture/user-update-picture';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../service/cus-service';
import { Observable } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cus-profile',
  imports: [
    SectionLogout,
    SectionTheme,
    RouterLink
  ],
  templateUrl: './cus-profile.html',
  styleUrl: './cus-profile.css',
})
export class CusProfile {

  private readonly authService = inject(AuthService);
  private readonly CustomerService = inject(CustomerService);


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

  meResource = rxResource<CustomerMe, void>({
    stream: () => this.CustomerService.meAuthenticated()
  });



  updatePicture() {
    this.openDialogService.open<null, null>(UserUpdatePictureComponent, {})
    .then(response => {});
  }
}


interface CustomerMe {
  name    : string
  email   : string
  phone   : string
}
