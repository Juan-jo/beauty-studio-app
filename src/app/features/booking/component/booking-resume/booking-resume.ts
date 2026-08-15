import { Component, computed, inject } from '@angular/core';
import { BookingService } from '../../service/booking.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { rxResource } from '@angular/core/rxjs-interop';
import { Booking } from '../../models/booking.models';
import { BookingDatePipe } from '../../../../core/pipes/booking-date.pipe';
import { DurationPipe } from '../../../../core/pipes/duration-pipe';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { BookingStatusBadge } from '../booking-status-badge/booking-status-badge';
import { getBookingStatusBarBg } from '../../models/booking-status.model';
import { CommonModule, NgClass } from '@angular/common';


type BookingUIState = 'idle' | 'loading' | 'error';


@Component({
  selector: 'app-booking-resume',
  imports: [
    BookingDatePipe,
    DurationPipe,
    CurrencyPipe,
    BookingStatusBadge,
    NgClass,
    CommonModule
],
  templateUrl: './booking-resume.html'
})
export class BookingResume {

  dialogRef = inject(DialogRef);

  
  private readonly bookingService = inject(BookingService);
  public readonly bookingId = inject<number>(DIALOG_DATA, { optional: false });

  
  booking = rxResource<Booking, void>({
    stream: () => this.bookingService.get(this.bookingId)
  });

  readonly state = computed<BookingUIState>(() => {

    if (this.booking.isLoading()) {
      return 'loading';
    }

    if (this.booking.error()) {
      return 'error';
    }

    return 'idle';
  });


  get bgStatus(): string {

    if(this.booking.hasValue()) {

      return getBookingStatusBarBg(this.booking.value().status);
    }

    return "";
  }
  

}


