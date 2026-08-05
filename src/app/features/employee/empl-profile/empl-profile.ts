import { Component, computed, inject } from '@angular/core';
import { SectionLogout } from '../../../shared/components/section-logout/section-logout';
import { SectionTheme } from '../../../shared/components/section-theme/section-theme';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../../core/services/auth';
import { EmployeeAuthenticatedService } from '../service/empl-authenticated.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { DurationPipe } from '../../../core/pipes/duration-pipe';

@Component({
  selector: 'app-empl-profile',
  imports: [
    SectionLogout,
    SectionTheme,
    RouterLink,
    DurationPipe
    
],
  templateUrl: './empl-profile.html',
  styleUrl: './empl-profile.css',
})
export class EmplProfile {

  private readonly auth = inject(AuthService);
  private readonly employeeAuthenticatedService = inject(EmployeeAuthenticatedService);
  



  get username() {
    return this.auth.userName;
  }



  meResource = rxResource<EmployeeMe, void>({
    stream: () => this.employeeAuthenticatedService.meAuthenticated()
  });

}


export interface EmployeeMe {
  email             : string
  phone             : string
  salonName         : string
  activeServices    : string
  workingHours      : string
}