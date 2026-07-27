import { Component, Input } from '@angular/core';
import { BookingDay } from '../../empl-agenda/model/employee-schedule.models';
import { DurationPipe } from '../../../../core/pipes/duration-pipe';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';

@Component({
  selector: 'empl-booking-card',
  imports: [
    DurationPipe,
    CurrencyPipe,
  ],
  templateUrl: './empl-booking-card.html',
  styleUrl: './empl-booking-card.css',
})
export class EmplBookingCard {

  @Input({ required: true }) booking!: BookingDay

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

}
