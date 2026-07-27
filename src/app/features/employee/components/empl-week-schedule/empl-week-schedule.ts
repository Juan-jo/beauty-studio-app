import { CommonModule } from '@angular/common';
import { Component, computed, effect, EventEmitter, inject, Output, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EmplScheduleService } from '../../empl-agenda/service/empl-schedule.service';
import { MxDayOfWeekPipe } from '../../../../core/pipes/mx-dayofweek-pipe';
import { EmplBookingCard } from '../empl-booking-card/empl-booking-card';



@Component({
  selector: 'empl-week-schedule',
  imports: [
    CommonModule,
    MxDayOfWeekPipe,
    EmplBookingCard
  ],
  templateUrl: './empl-week-schedule.html',
  styleUrl: './empl-week-schedule.css',
})
export class EmplWeekSchedule {


  private readonly emplScheduleService = inject(EmplScheduleService);

  @Output() changeView = new EventEmitter<string>();
 
  

  constructor() {

    effect(() => {
      const response = this.week();
  
      if (response?.currentDate) {
        this.currrenDate.set(response.currentDate);
      }
    });
  }


  viewMonth() {
    this.changeView.emit('month')
  }

  

  currrenDate = signal<string>('');

  weekResource = resource({

    loader: async () => {

      return await firstValueFrom(this.emplScheduleService.getWeek());
      
    }
  });
  
  isLoadingWeek = this.weekResource.isLoading;
  
 
  week = computed(() => this.weekResource.value());

  
  changeDate(date: string) {
    this.currrenDate.set(date)
  }

  
  scheduleDayResource = resource({
    params: () => ({ date: this.currrenDate() }),

    loader: async ({ params }) => {

      if(params.date == '') {
        return;
      }

     return await firstValueFrom(this.emplScheduleService.getDaySchedule(params.date));
      
    }
  });
  
  isLoadingScheduleDay = this.scheduleDayResource.isLoading;

  scheduleDay = computed(() => this.scheduleDayResource.value());


}

