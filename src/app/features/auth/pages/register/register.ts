import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { finalize } from 'rxjs';
import { getHomeRouteForRole } from '../../../../core/guards/role.guard';
import { PushNotificationService } from '../../../../core/notifications/push-notification.service';
import { AppConfigService } from '../../../../config/app-config.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',

})
export class Register {

  private fb = inject(FormBuilder);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly pushNotificationService = inject(PushNotificationService);
  private readonly appConfig = inject(AppConfigService);




  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);


  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]],
    serial: [this.appConfig.salonSerial]
  }, { validators: this.passwordMatchValidator });

  
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    // Si coincidían y había un error previo de disparidad, lo limpia
    if (control.get('confirmPassword')?.hasError('passwordMismatch')) {
      delete control.get('confirmPassword')?.errors?.['passwordMismatch'];
      control.get('confirmPassword')?.updateValueAndValidity({ onlySelf: true });
    }

    return null;
  }

  
  doRegister() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }


    this.enableControls(false);
    

    this.isLoading.set(true);


    this.authService
      .register(this.form.getRawValue())
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



        }
      });
      
    
    
  }

  private enableControls( value: boolean ): void {

    Object.keys(this.form.controls).forEach(controlName => {
      
      if(value) {
        this.form.controls[controlName].enable();
      }
      else {
        this.form.controls[controlName].disable();
      }
      
    })

  }

}
