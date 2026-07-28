import { Component, inject } from '@angular/core';
import { InstallPwa } from "../../../../shared/components/install-pwa/install-pwa";
import { AuthService } from '../../../../core/services/auth';
import { getHomeRouteForRole } from '../../../../core/guards/role.guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [InstallPwa],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);


  fakeLogin() {

    
    this.authService.saveToken(
      'eyJhbGciOiJIUzM4NCJ9.eyJzYWxvbklkIjoxLCJyb2xlcyI6WyJTQUxPTl9BRE1JTiIsIkVNUExPWUVFIl0sIm5hbWUiOiJYb2NoIEF6dWNlbmEiLCJ1c2VySWQiOjksInN1YiI6InhvY2guZWFAZ21haWwuY29tIiwiaWF0IjoxNzg1MjEyNTQ0LCJleHAiOjE4MTY3NDg1NDR9.uTK0TJALPz8zp3GhjVXLI8Om62fiXJhQ7IXyqMf3K_iTGdRstYqD2afMGCJGAyXR'
    );

    const targetRoute = getHomeRouteForRole(this.authService.getRoles());

    this.router.navigate([targetRoute], { replaceUrl: true });

  }
}
