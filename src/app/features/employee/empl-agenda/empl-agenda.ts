import { Component, computed, resource, signal } from '@angular/core';
import { delay, firstValueFrom, of } from 'rxjs';
import { BookingDay, MonthDaySchedule, MonthSchedule } from './model/employee-schedule.models';
import { EmplWeekSchedule } from '../components/empl-week-schedule/empl-week-schedule';

@Component({
  selector: 'app-empl-agenda',
  imports: [
    EmplWeekSchedule
  ],
  templateUrl: './empl-agenda.html',
  styleUrl: './empl-agenda.css',
})
export class EmplAgenda {

  viewMode = signal<'week' | 'month'>('week');

  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  dayResource = resource({
    params: () => ({ mode: this.viewMode() }),

    loader: async ({ params }) => {


      switch (params.mode) {
        case 'week':
          return of([]).pipe(delay(400));
        case 'month':
          return await firstValueFrom(this.getMockMonthSchedule());
      }
      
    }
  });
  
  isLoading = this.dayResource.isLoading;
  scheduleData = computed(() => this.dayResource.value());

  setViewMode(mode:'week' | 'month') {
    this.viewMode.set(mode);
  }


  // MOCK DATA: Vista Mes (Julio 2026)
  private getMockMonthSchedule() {
    const days: MonthDaySchedule[] = [];
    
    days.push(
      { dayNumber: 29, date: '2026-06-29', isCurrentMonth: false, bookings: [] },
      { dayNumber: 30, date: '2026-06-30', isCurrentMonth: false, bookings: [] }
    );

    for (let i = 1; i <= 31; i++) {
      const dayStr = i < 10 ? `0${i}` : `${i}`;
      const dateStr = `2026-07-${dayStr}`;
      
      const dayBookings: BookingDay[] = [];

      if (i === 10 || i === 15) {
        dayBookings.push({
          id: 200 + i,
          status: 'COMPLETED',
          serviceName: 'Corte de cabello',
          price: 35,
          start: '10:00 AM',
          end: '11:00 AM',
          duration: 60,
          customer: { name: 'Lucía M.', pictureUrl: '' }
        });
      } else if (i === 26) { 
        dayBookings.push(
          {
            id: 250,
            status: 'IN_PROGRESS',
            serviceName: 'Lifting Pestañas',
            price: 65,
            start: '10:30 AM',
            end: '12:00 PM',
            duration: 90,
            customer: { name: 'Sofía R.', pictureUrl: '' }
          },
          {
            id: 251,
            status: 'CONFIRMED',
            serviceName: 'Pedicura Spa',
            price: 35,
            start: '01:00 PM',
            end: '01:45 PM',
            duration: 45,
            customer: { name: 'Camila L.', pictureUrl: '' }
          }
        );
      } else if (i === 28) {
        dayBookings.push({
          id: 260,
          status: 'CONFIRMED',
          serviceName: 'Manicura Rusa',
          price: 45,
          start: '04:00 PM',
          end: '05:00 PM',
          duration: 60,
          customer: { name: 'Valeria G.', pictureUrl: '' }
        });
      }

      days.push({
        dayNumber: i,
        date: dateStr,
        isCurrentMonth: true,
        isToday: i === 26,
        bookings: dayBookings
      });
    }

    days.push(
      { dayNumber: 1, date: '2026-08-01', isCurrentMonth: false, bookings: [] },
      { dayNumber: 2, date: '2026-08-02', isCurrentMonth: false, bookings: [] }
    );

    const monthData: MonthSchedule = {
      monthName: 'Julio 2026',
      days
    };

    return of(monthData).pipe(delay(400));
  }
  
}
