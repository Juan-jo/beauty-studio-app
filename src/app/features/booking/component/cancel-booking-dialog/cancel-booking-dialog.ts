import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { BookingService } from '../../../booking/service/booking.service';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { UIState } from '../../../../core/ui/ui-state.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { UIStateError } from '../../../../core/ui/state-error/state-error';
import { UIStateSuccess } from '../../../../core/ui/state-success/state-success';
import { BookingDay } from '../../../employee/empl-agenda/model/employee-schedule.models';

@Component({
  selector: 'app-cancel-booking-dialog',
  imports: [ 
    CurrencyPipe,
    CommonModule,
    ReactiveFormsModule,
    UIStateSuccess,
    UIStateError
  ],
  templateUrl: './cancel-booking-dialog.html'
})
export class CancelBookingDialog {




  private readonly cdr = inject(ChangeDetectorRef);

  private readonly bookingService = inject(BookingService);

  public readonly booking = inject<BookingDay>(DIALOG_DATA, { optional: false });

  dialogRef = inject(DialogRef);

  public state = signal<UIState>('idle');

  public isSubmitting = signal<boolean>(false);


  message =  new FormControl('',[Validators.required]);



  submit() {

    
    if(this.message.invalid) {
      
      this.message.markAllAsTouched();
      return;
    }
  
    this.isSubmitting.set(true)


    this.bookingService.cancel(this.booking.id, this.message.value ?? '')
    
      .pipe(
        finalize(() => this.isSubmitting.set(false))
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


  close(value: boolean = false) {
    this.dialogRef.close(value);
  }



  retry() {
    this.state.set('idle')
  }

}
