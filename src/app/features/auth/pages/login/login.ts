import { Component, inject, signal } from '@angular/core';
import { InstallPwa } from "../../../../shared/components/install-pwa/install-pwa";
import { AuthService } from '../../../../core/services/auth';
import { getHomeRouteForRole } from '../../../../core/guards/role.guard';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { PushNotificationService } from '../../../../core/notifications/push-notification.service';

@Component({
  selector: 'app-login',
  imports: [InstallPwa, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly pushNotificationService = inject(PushNotificationService);

  readonly isLoading = signal(false);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    })
  });

  doLogin(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);

    this.authService
      .login(this.form.getRawValue())
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: ({ token }) => {

          this.authService.saveToken(token);

          this.pushNotificationService.initPushNotifications().then(_=>{})
          
          this.authService.loadAuthenticatedUser()
          .subscribe({

            next: () => {

              this.router.navigate(
                [
                  getHomeRouteForRole(
                    this.authService.getRoles()
                  )
                ],
                {
                  replaceUrl: true
                }
              );

            },

            error: () => {

              this.authService.logout();

            }

          });

        },
        error: err => {

          

          if(err?.status == 404) {

            this.form.setErrors({emailNotFound: true})

          }

          else {
            this.form.setErrors({passwordInvalid: true})
          }

        }
      });

  }

}