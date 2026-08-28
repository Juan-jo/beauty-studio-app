import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UIState } from '../../../../core/ui/ui-state.model';
import { PASSWORD_PATTERN, passwordMatchValidator } from '../../../../core/validators/password-match.validator';
import { UIStateSuccess } from '../../../../core/ui/state-success/state-success';
import { UIStateError } from '../../../../core/ui/state-error/state-error';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';
import { AuthService } from '../../../../core/services/auth';


@Component({
  selector: 'app-user-update-pwd',
  imports: [
    ReactiveFormsModule,
    UIStateSuccess,
    UIStateError
  ],
  templateUrl: './user-update-pwd.html'
})
export class UserUpdatePwd {

  

  isSubmitting = signal(false);

  private fb = inject(FormBuilder);
  private location = inject(Location);


  private readonly authService = inject(AuthService); 


  state = signal<UIState>('idle');


  form = this.fb.group({
    
    newPassword:  ['', [
      Validators.required, 
      Validators.minLength(5), 
      Validators.maxLength(16),
      Validators.pattern(PASSWORD_PATTERN)
    ]],
    
      confirmPassword:   ['', [
        Validators.required, 
        Validators.minLength(2), 
        Validators.maxLength(16)
      ]],
  },{
    validators: passwordMatchValidator
  });

  

  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  toggleNewPassword(): void {
    this.showNewPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }

  ngOnInit(): void {
    
    
    
    
  }

  

  
  goBack(): void {
    
  }

  onSubmit(): void {
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);


    this.authService.updatePaswword(
      this.form.getRawValue()
    )
    .pipe(
      finalize(() => this.isSubmitting.set(false))
    )
    .subscribe({
      next: (resp) => this.state.set('success'),
      error: (resp) => {
        this.state.set('error')
      }
    })
    
    
  }

  onClose() {
    this.location.back();
  }

  retry() {
    this.state.set('idle')
  }

}
