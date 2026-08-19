import { Pipe, PipeTransform, inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'bookingDate',
  standalone: true
})
export class BookingDatePipe implements PipeTransform {

  private readonly locale = inject(LOCALE_ID);

  transform(value: string | Date): string {

    const date = new Date(value);
    const now = new Date();

    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffDays = Math.floor(
      (startDate.getTime() - startToday.getTime()) / 86400000
    );

    const hour = formatDate(date, 'HH:mm a', this.locale);

    switch (diffDays) {
      case 0:
        return `Hoy · ${hour}`;

      case 1:
        return `Mañana · ${hour}`;

      case -1:
        return `Ayer · ${hour}`;
    }

    // Dentro de la misma semana
    if (Math.abs(diffDays) < 7) {
      return `${formatDate(date, 'EEEE', this.locale)} · ${hour}`;
    }

    // Mismo año
    if (date.getFullYear() === now.getFullYear()) {
      return `${formatDate(date, 'd \'de\' MMMM', this.locale)} · ${hour}`;
    }

    return `${formatDate(date, 'd MMM yyyy', this.locale)} · ${hour}`;
  }

}