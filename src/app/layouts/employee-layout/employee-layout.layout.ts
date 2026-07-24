import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AppConfigService } from '../../config/app-config.service';
import { AuthService } from '../../core/services/auth';
import { getHomeRouteForRole } from '../../core/guards/role.guard';

@Component({
  selector: 'app-employee-layout',
  imports: [RouterOutlet,RouterLink ,RouterLinkActive],
  templateUrl: './employee-layout.layout.html',
  styles: ``,
})
export class EmployeeLayoutLayout {


  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);


  logout() {
    this.authService.logout();

    const targetRoute = getHomeRouteForRole('PUBLIC'); 
    this.router.navigate([targetRoute], { replaceUrl: true });
  }


}
