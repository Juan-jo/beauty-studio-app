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

    this.authService.saveLogin(
      'eyJhbGciOiJIUzM4NCJ9.eyJzYWxvbklkIjoxLCJyb2xlcyI6WyJFTVBMT1lFRSJdLCJuYW1lIjoiWG9jaCBBenVjZW5hIiwidXNlcklkIjo5LCJzdWIiOiJ4b2NoLmVtcGxAZ21haWwuY29tIiwiaWF0IjoxNzg0ODY2MTQyLCJleHAiOjE4MTY0MDIxNDJ9.Z1GvRBQbL6Lc9f5BIKBXWp5lzqNGPPZmPgVcqU9UvR1g0oVb0lMBrIFaM8fEKv0l',
      'EMPLOYEE'
    );

    const targetRoute = getHomeRouteForRole('EMPLOYEE'); // e.g. '/employee/agenda'
    this.router.navigate([targetRoute], { replaceUrl: true });

  }
}
