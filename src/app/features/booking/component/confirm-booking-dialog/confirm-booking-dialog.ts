import { Component, inject, signal } from '@angular/core';
import { BookingService } from '../../../booking/service/booking.service';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { CommonModule } from '@angular/common';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { UIState } from '../../../../core/ui/ui-state.model';
import { finalize } from 'rxjs';
import { UIStateError } from '../../../../core/ui/state-error/state-error';
import { UIStateSuccess } from '../../../../core/ui/state-success/state-success';
import { BookingDay } from '../../../employee/empl-agenda/model/employee-schedule.models';
import { DurationPipe } from '../../../../core/pipes/duration-pipe';

@Component({
  selector: 'app-confirm-booking-dialog',
  imports: [ 
    CurrencyPipe,
    CommonModule,
    UIStateSuccess,
    UIStateError,
    DurationPipe
  ],
  templateUrl: './confirm-booking-dialog.html'
})
export class ConfirmBookingDialog {


  private readonly bookingService = inject(BookingService);

  public readonly booking = inject<BookingDay>(DIALOG_DATA, { optional: false });

  dialogRef = inject(DialogRef);

  public state = signal<UIState>('idle');

  public isSubmitting = signal<boolean>(false);



  submit() {

    this.isSubmitting.set(true);

    this.bookingService.confirm(this.booking.id)
    .pipe(
      finalize(() => this.isSubmitting.set(false))
    )
    .subscribe({
      next: () => {

      
        this.state.set('success')

      },
      error: (err) => {

        this.state.set('error')

      }
    });


  }


  close(value: boolean = false) {
    this.dialogRef.close(value);
  }



  retry() {
    this.state.set('idle')
  }

}
