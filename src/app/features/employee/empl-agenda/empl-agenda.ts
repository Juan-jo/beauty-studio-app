import { Component, computed, ElementRef, OnInit, resource, signal, ViewChild } from '@angular/core';
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
export class EmplAgenda implements OnInit {
  

  @ViewChild('weekSection') weekSection!: ElementRef;


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


  ngOnInit(): void {
    setTimeout(() => {
      this.weekSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        
      });


    }, 50);
  }
 
  
}
