import { Component } from '@angular/core';
import { SectionLogout } from '../../../shared/components/section-logout/section-logout';
import { SectionTheme } from '../../../shared/components/section-theme/section-theme';
import { EmplServices } from '../components/empl-services/empl-services';
import { RouterLink } from "@angular/router";

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

  isOpenModalService = false;


  closeModalService() {
    this.isOpenModalService = false
  }

}
