import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UIState } from '../../../../core/ui/ui-state.model';
import { AuthService } from '../../../../core/services/auth';
import { finalize } from 'rxjs';
import { UIStateError } from '../../../../core/ui/state-error/state-error';
import { Location } from '@angular/common';
import { OpenDialogService } from '../../../../shared/dialog/open-dialog';
import { SuccessAccountDeleted } from '../../components/success-account-deleted/success-account-deleted';
import { getHomeRouteForRole } from '../../../../core/guards/role.guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-delete-account',
  imports: [
    ReactiveFormsModule,
    UIStateError
  ],
  templateUrl: './user-delete-account.html'
})
export class UserDeleteAccount {


  private readonly authService = inject(AuthService); 
  private readonly openDialogService = inject(OpenDialogService); 
  private readonly router = inject(Router);


  private fb = inject(FormBuilder);
  private location = inject(Location);
  
  isSubmitting = signal(false);


  state = signal<UIState>('idle');

  confirmationText = 'ELIMINAR'

  form = this.fb.group({
    confirmationText:  ['', [Validators.required]],
    
  });

  onSubmit(): void {
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    this.isSubmitting.set(true);


    this.authService.deleteAccount()
    .pipe(
      finalize(() => this.isSubmitting.set(false))
    )
    .subscribe({
      next: (resp) => {

        this.openDialogService.open<any, any>(
        
          SuccessAccountDeleted,

          {
            closeOnHardwareBack: false
          }
    
        ).then(value => {

          if(typeof(value) == 'boolean') {

            const targetRoute = getHomeRouteForRole(['ROLE_PUBLIC']); 
            this.router.navigate([targetRoute], { replaceUrl: true });

          }
        });

      },
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
