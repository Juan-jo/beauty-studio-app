import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { UIState } from '../../../../core/ui/ui-state.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SalonAdminService } from '../../service/salon-admin.service';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, finalize, map } from 'rxjs';
import { UIStateError } from '../../../../core/ui/state-error/state-error';
import { UIStateSuccess } from '../../../../core/ui/state-success/state-success';

@Component({
  selector: 'app-edit-salon-employee',
  imports: [
    ReactiveFormsModule,
    UIStateError,
    UIStateSuccess
  ],
  templateUrl: './edit-salon-employee.html'
})
export class EditSalonEmployee  implements OnInit  {

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);
  private readonly salonAdminService = inject(SalonAdminService)
  private readonly route = inject(ActivatedRoute);

  state = signal<UIState>('idle');
  
  isSubmitting = false;
  employeeId!: number;

  errorMessage = '';

  showPassword = false

  currentPictureUrl = ''

  get isEdit() {
    return !!this.employeeId;
  }

  form = this.fb.group({

    firstName: [
      '',
      Validators.required
    ],

    lastName: [
      '',
      Validators.required
    ],

    email: [
      null,
      [
        Validators.required,
        Validators.email
      ]
    ],

    phone: [
      null,
      [
        Validators.required,
        
      ]
    ],

    password: [
      null,

      [
        Validators.required,
        
      ]
    ]
  });


  ngOnInit(): void {
    
    this.route.queryParams
    .pipe(
      map(params => params['id']),
      distinctUntilChanged()
    )
    .subscribe((employeeId: any) => {
      if (employeeId) {
        
        this.employeeId = employeeId

        this.fetchEmployee(employeeId)

      }

    });

  }

  fetchEmployee(employeeId: number) {
    
    this.state.set('loading')



    this.salonAdminService.getEmployeeById(employeeId)
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: (data) => {

          let { pictureUrl } = data;

          this.currentPictureUrl = pictureUrl;

          this.form.patchValue({ ...data })

          this.form.controls.password.clearValidators();

          this.state.set('idle')
          this.cdr.markForCheck()


        },
        error: err => {

          this.state.set('error')
          this.cdr.markForCheck()

        }
      })
    

  }

  onClose() {
    history.back();
  }

  retry() {
    this.state.set('idle')
  }

  save() {

    console.log(this.form.value)

    Object.keys(this.form.controls).forEach(ctrlKey => {

      const control = this.form.get(ctrlKey);

      if (control?.invalid) {
        console.log(`Control fallido: ${ctrlKey}`, control.errors);
      }

    })

    if (this.form.invalid) {

      this.form.markAllAsTouched();
      return;
    }
    

    this.isSubmitting = true;



    const req$ = this.isEdit
      ? this.salonAdminService.updateEmployee(this.employeeId, this.form.getRawValue())
      : this.salonAdminService.createEmployee(this.form.getRawValue())


    req$
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => {

          this.state.set('success')
          this.cdr.markForCheck()


        },
        error: err => {

          this.state.set('error')
          this.cdr.markForCheck()

        }
      })
    
  }



  


}
