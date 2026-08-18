import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, signal } from '@angular/core';
import { BookingDay } from '../../empl-agenda/model/employee-schedule.models';
import { DurationPipe } from '../../../../core/pipes/duration-pipe';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../booking/service/booking.service';
import { BookingStatusBadge } from '../../../booking/component/booking-status-badge/booking-status-badge';
import { OpenDialogService } from '../../../../shared/dialog/open-dialog';
import { BookingResume } from '../../../booking/component/booking-resume/booking-resume';
import { ConfirmBookingDialog } from '../../../booking/component/confirm-booking-dialog/confirm-booking-dialog';
import { CancelBookingDialog } from '../../../booking/component/cancel-booking-dialog/cancel-booking-dialog';

@Component({
  selector: 'empl-booking-card',
  imports: [
    DurationPipe,
    CurrencyPipe,
    CommonModule,
    BookingStatusBadge
  ],
  templateUrl: './empl-booking-card.html',
  styleUrl: './empl-booking-card.css',
})
export class EmplBookingCard {


  private readonly bookingService = inject(BookingService);
  private readonly openDialogService = inject(OpenDialogService);
  


  @Output() reloadSchedule = new EventEmitter<void>();

  @Input({ required: true }) booking!: BookingDay

  @Input() updateUrl: boolean = true

  viewModal = signal<'' | 'confirm' | 'cancel'>('');


  isOpenModal = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  isOpenDropDown = signal<boolean>(false);

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpenDropDown.set(false);
    }
  }


  constructor(private eRef: ElementRef) { }


  toggleMenu() {
    this.isOpenDropDown.update((v) => !v);
  }

  selectOption(action: 'cancel' | 'remind' | 'reschedule') {

    this.isOpenDropDown.set(false);

    if (action === 'cancel') {
    }
  }


  closeModal() {
    this.isOpenModal.set(false);
  }

 


  askConfirm() {
    

    this.openDialogService.open<any, BookingDay>(ConfirmBookingDialog, {
      data: this.booking
    }
    ).then(response => {

      if (typeof (response) === 'boolean' && response === true) {
        this.reloadSchedule.emit();
      }


    });

  }


  openBooking() {
    
    this.openDialogService.open<any, number>(BookingResume, {
      data: this.booking.id,
      updateUrl: this.updateUrl
    }
    ).then(response => {
      




    });
  }


  openCancel() {


    this.openDialogService.open<boolean, BookingDay>(CancelBookingDialog, {
      data: this.booking,
      updateUrl: this.updateUrl
    }
    ).then(response => {

      if (typeof (response) === 'boolean' && response === true) {
        this.reloadSchedule.emit();
      }

    });

  }


  confirmStart() {
    this.isSubmitting.set(true);

    this.bookingService.start(this.booking.id).subscribe({
      next: () => {

        this.isSubmitting.set(false);
        this.reloadSchedule.emit();

      },
      error: (err) => {

        this.isSubmitting.set(false)

      }
    });
  }

  confirmComplete() {
    this.isSubmitting.set(true);

    this.bookingService.complete(this.booking.id).subscribe({
      next: () => {

        this.isSubmitting.set(false);
        this.reloadSchedule.emit();

      },
      error: (err) => {

        this.isSubmitting.set(false)

      }
    });
  }


}
