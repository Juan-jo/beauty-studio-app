import { Component } from '@angular/core';
import { SectionLogout } from '../../../shared/components/section-logout/section-logout';
import { SectionTheme } from '../../../shared/components/section-theme/section-theme';

@Component({
  selector: 'app-cus-profile',
  imports: [
    SectionLogout,
    SectionTheme
  ],
  templateUrl: './cus-profile.html',
  styleUrl: './cus-profile.css',
})
export class CusProfile {

}
