import { Component, Input } from '@angular/core';
import { BookingStatus, getBookingStatusClasses, getBookingStatusLabel } from '../../models/booking-status.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'booking-status-badge',
  imports: [CommonModule],
  standalone: true,
  template: `
    <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border"
      [ngClass]="classes">
      {{ label }}
    </span>
  `
})
export class BookingStatusBadge {


  @Input({ required: true }) status!: BookingStatus;

  get classes(): string {
    return getBookingStatusClasses(this.status);
  }

  get label(): string {
    return getBookingStatusLabel(this.status);
  }
  
}
