import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, output, signal } from '@angular/core';
import { BookingDay } from '../../empl-agenda/model/employee-schedule.models';
import { DurationPipe } from '../../../../core/pipes/duration-pipe';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../booking/service/booking.service';

@Component({
  selector: 'empl-booking-card',
  imports: [
    DurationPipe,
    CurrencyPipe,
    CommonModule
  ],
  templateUrl: './empl-booking-card.html',
  styleUrl: './empl-booking-card.css',
})
export class EmplBookingCard {


  private readonly bookingService = inject(BookingService);

  @Output() reloadSchedule = new EventEmitter<void>();

  @Input({ required: true }) booking!: BookingDay

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


  getInitials(name: string): string {
    if (!name) return 'CL';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  bookingStatusBadge(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-700';

      case 'CONFIRMED':
        return 'bg-sky-100 text-sky-700';

      case 'IN_PROGRESS':
        return 'bg-violet-100 text-violet-700';

      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-700';

      case 'CANCELLED':
        return 'bg-red-100 text-red-700';

      case 'NO_SHOW':
        return 'bg-gray-200 text-gray-700';

      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  bookingStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'CONFIRMED': return 'Confirmada';
      case 'IN_PROGRESS': return 'En servicio';
      case 'COMPLETED': return 'Finalizada';
      case 'CANCELLED': return 'Cancelada';
      case 'NO_SHOW': return 'No asistió';
      default: return status;
    }
  }

  toggleMenu() {
    this.isOpenDropDown.update((v) => !v);
  }

  selectOption(action: 'cancel' | 'remind' | 'reschedule') {

    this.isOpenDropDown.set(false);

    if (action === 'cancel') {
      this.askCancel();
    }
  }


  closeModal() {
    this.isOpenModal.set(false);
  }

  askConfirm() {
    this.viewModal.set('confirm')
    this.isOpenModal.set(true);
  }

  confirmBooking() {

    this.isSubmitting.set(true);

    this.bookingService.confirm(this.booking.id).subscribe({
      next: () => {

        this.isSubmitting.set(false);
        this.isOpenModal.set(false);
        this.reloadSchedule.emit();

      },
      error: (err) => {

        this.isSubmitting.set(false)

      }
    });

  }

  askCancel() {
    this.viewModal.set('cancel')
    this.isOpenModal.set(true);
  }

  confirmCancel() {

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
