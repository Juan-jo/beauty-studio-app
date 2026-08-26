import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { UIState } from '../../../../core/ui/ui-state.model';
import { UIStateError } from '../../../../core/ui/state-error/state-error';
import { UIStateSuccess } from '../../../../core/ui/state-success/state-success';
import { AuthService } from '../../../../core/services/auth';
import { finalize, switchMap } from 'rxjs';
import { PhoneFormatDirective } from '../../../../core/directives/phone-number-format.directive';

interface UserProfileDTO {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pictureUrl: string;
}

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    UIStateError,
    UIStateSuccess,
    PhoneFormatDirective
  ],
  standalone: true,
  templateUrl: './user-profile.html',
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background-color: color-mix(in srgb, var(--color-brand-50) 40%, transparent);
    }
  `
})
export class UserProfile implements OnInit {
  
  private readonly authService = inject(AuthService);

  private fb = inject(FormBuilder);
  private location = inject(Location);

  isSubmitting = signal(false);


  state = signal<UIState>('loading');

  user = this.authService.currentUser;

  userInitials = computed(() => {

    const name = this.user()?.name;

    if (!name) {
      return '';
    }

    return name
      .trim()
      .split(' ')
      .slice(0, 1 )
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();

  });  

  form = this.fb.group({
    firstName:  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    lastName:   ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    email:      ['', [Validators.required, Validators.email]],
    phone:      ['', [Validators.required, Validators.minLength(10)]]
  });

  
  ngOnInit(): void {
    
    
    this.authService.getProfile()
    .subscribe({
      next: (value) => {
        
        this.loadProfileData(value)

      },

      error: (err) => {


      }
    })
    
  }

  
  loadProfileData(dto: UserProfileDTO) {
    this.form.patchValue(dto);
    this.state.set('idle');
  }

  
  goBack(): void {
    
    this.location.back();
  }

  onSubmit(): void {
    
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.authService.updateProfile(this.form.getRawValue())
    .pipe(
      
      switchMap(() => this.authService.refresh()),
      
      finalize(() => this.isSubmitting.set(false))
    )
    .subscribe({
      next: () => {
        
        this.state.set('success');
      },
      error: ({status, code, violation}) => {

        if(violation === 'AlreadyEmail') {

          this.form.controls.email.setErrors({AlreadyEmail: true})
        }
        else {
          this.state.set('error');
        }
        
        
      }
    });

  }

  onClose() {
    this.location.back();

  }

  retry() {
    this.state.set('idle')
  }
}


