import { CommonModule } from '@angular/common';
import { Component, computed, effect, EventEmitter, inject, Output, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EmplScheduleService } from '../../empl-agenda/service/empl-schedule.service';
import { MxDayOfWeekPipe } from '../../../../core/pipes/mx-dayofweek-pipe';
import { EmplBookingCard } from '../empl-booking-card/empl-booking-card';
import { EmplAddService } from '../empl-add-service/empl-add-service';
import { Router } from '@angular/router';
import { OpenDialogService } from '../../../../shared/dialog/open-dialog';



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
  private readonly openDialogService = inject(OpenDialogService);
  private router = inject(Router);



  @Output() changeView = new EventEmitter<string>();
 
  currrentDate = signal<string>('');
  today = signal<string>('');

  constructor() {

    effect(() => {
      const response = this.week();
  
      if (response?.currentDate) {
        this.currrentDate.set(response.currentDate);
        this.today.set(response.currentDate);
      }
    });
  }


  viewMonth() {
    this.changeView.emit('month')
  }

  

  

  weekResource = resource({

    loader: async () => {

      return await firstValueFrom(this.emplScheduleService.getWeek());
      
    }
  });
  
  isLoadingWeek = this.weekResource.isLoading;
  
 
  week = computed(() => this.weekResource.value());

  
  changeDate(date: string) {
    this.currrentDate.set(date)
  }

  
  scheduleDayResource = resource({
    params: () => ({ date: this.currrentDate() }),

    loader: async ({ params }) => {

      if(params.date == '') {
        return;
      }

     return await firstValueFrom(this.emplScheduleService.getDaySchedule(params.date));
      
    }
  });
  
  isLoadingScheduleDay = this.scheduleDayResource.isLoading;

  scheduleDay = computed(() => this.scheduleDayResource.value());

  
  reloadScheduleDayResource() {

    this.scheduleDayResource.reload();
  }



  openServicesSheet() {


    this.openDialogService.open<string|null, string>(EmplAddService, {})
    .then(response => {


      if(typeof(response) === 'string') {
        
        this.router.navigate(['/employee/booking'], {
          queryParams: { services: response },
        });    
        
      }

    });

  }


}

