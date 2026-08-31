import { Component, inject, signal } from '@angular/core';
import { InstallPwa } from "../../../../shared/components/install-pwa/install-pwa";
import { AuthService } from '../../../../core/services/auth';
import { getHomeRouteForRole } from '../../../../core/guards/role.guard';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { PushNotificationService } from '../../../../core/notifications/push-notification.service';

@Component({
  selector: 'app-login',
  imports: [InstallPwa, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html'
 
})
export class Login {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly pushNotificationService = inject(PushNotificationService);

  readonly isLoading = signal(false);

  showPassword = signal<boolean>(false);

  form = new FormGroup({
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

    this.enableControls(false);

    this.authService
      .login(this.form.getRawValue())
      .pipe(
        finalize(() => {
          this.enableControls(true);
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: ({ token }) => {

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


  private enableControls( value: boolean ): void {

    Object.keys(this.form.controls).forEach(controlName => {
      
      if(value) {
        this.form.get(controlName)?.enable();
        
      }
      else {
        this.form.get(controlName)?.disable();
      }
      
    })

  }

}