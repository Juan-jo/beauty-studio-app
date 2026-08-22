import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HasRoleDirective } from '../../../../core/directives/has-role';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../../../core/services/auth';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { CustomerBookingService } from '../../../customer/service/cus-booking';
import { EmployeeBookingService } from '../../../employee/service/empl-booking.service';
import { finalize } from 'rxjs';
import { BookingDatePipe } from '../../../../core/pipes/booking-date.pipe';

@Component({
  selector: 'app-booking-checkout-dialog',
  imports: [
    HasRoleDirective,
    ReactiveFormsModule,
    CommonModule,
    CurrencyPipe,
    BookingDatePipe
  ],
  templateUrl: './booking-checkout-dialog.html'
})
export class BookingCheckoutDialog implements OnInit {
  

  public readonly bookingCheckoutData = inject<BookingCheckoutData>(DIALOG_DATA, { optional: false });
  private readonly customerBookingService = inject(CustomerBookingService);
  private readonly employeeBookingService = inject(EmployeeBookingService);
  
  private readonly authService = inject(AuthService);

  private readonly cdr = inject(ChangeDetectorRef);
  private location = inject(Location);



  form = new FormGroup({
    
    employeeId: new FormControl<number|any>(
      this.bookingCheckoutData.employee.employeeId, [Validators.required]),
    
    dateTime: new FormControl<string | any>(
      this.bookingCheckoutData.dateTime, [Validators.required]),
    
    serviceIds: new FormControl(this.bookingCheckoutData.serviceIds),

    total: new FormControl(this.bookingCheckoutData.total),


    // name & phone for role employee & salon admin
    name: new FormControl<string>(""), 
    phone: new FormControl<string>(""),

  })


  get f() {
    return this.form.controls;
  }
  

  isSubmitting = false;
  
  state: 'idle' | 'success' | 'error' = 'idle';
  errorMessage = '';


  

  ngOnInit(): void {
    
    const isEmployee = this.authService.hasRoles(['ROLE_EMPLOYEE','ROLE_SALON_ADMIN']);

    if (isEmployee) {
      this.form.controls.name.setValidators(Validators.required);
      this.form.controls.phone.setValidators(Validators.required);

      this.form.controls.name.updateValueAndValidity();
      this.form.controls.phone.updateValueAndValidity();
    }
    
   
  }


  closeConfirmationModal() {
    this.location.back();

   
    
  }

  navigateAgenda() {
    
    history.back();
    history.back();
    
  }

 
  confirmBookingSuccess() {

    if(this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }


    const isEmployee = this.authService.hasRoles(['ROLE_EMPLOYEE','ROLE_SALON_ADMIN']);

    this.isSubmitting = true;
    this.state = 'idle';

    
    const payload: BookingPayload = {
      serviceIds: this.bookingCheckoutData.serviceIds,
      employeeId: this.bookingCheckoutData.employee.employeeId,
      dateTime: this.bookingCheckoutData.dateTime,
    };


    if (isEmployee) {
      payload.name = this.f.name.value as string;
      payload.phone = this.f.phone.value as string;
    }
    
    
    const booking$ = isEmployee
      ? this.employeeBookingService.createBooking(payload)
      : this.customerBookingService.createBooking(payload);


    booking$
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => {

          this.state = 'success';
          this.cdr.markForCheck()
        

        },
        error: err => {

          this.confirmBookingError(err)

        }
      })

  }

 
  confirmBookingError(err: any) {

    this.isSubmitting = false;
    this.state = 'error';
    
    this.errorMessage = 
    'El horario seleccionado ya no se encuentra disponible. Por favor elige otro horario.';

    this.cdr.markForCheck()

  }
}


export interface BookingCheckoutData {
  
  services: string[];

  serviceIds: string;
  
  employee: {
    employeeId  : number
    name        : string
    pictureUrl  : string
  };

  dateTime: string;

  total: string

}



interface BookingPayload {
  serviceIds: string;
  employeeId?: number;
  dateTime: string;
  name?: string;
  phone?: string;
}
