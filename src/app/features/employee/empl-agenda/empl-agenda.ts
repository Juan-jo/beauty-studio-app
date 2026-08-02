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
          return of([]).pipe(delay(400));
      }
      
    }
  });
  
  isLoading = this.dayResource.isLoading;
  scheduleData = computed(() => this.dayResource.value());

  setViewMode(mode:'week' | 'month') {
    this.viewMode.set(mode);
  }


  // MOCK DATA: Vista Mes (Julio 2026)
 
  
}
