import { CommonModule } from '@angular/common';
import { Component, computed, effect, EventEmitter, inject, Output, resource, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { EmplScheduleService } from '../../empl-agenda/service/empl-schedule.service';
import { MxDayOfWeekPipe } from '../../../../core/pipes/mx-dayofweek-pipe';
import { EmplBookingCard } from '../empl-booking-card/empl-booking-card';
import { Dialog } from '@angular/cdk/dialog';
import { EmplAddService } from '../empl-add-service/empl-add-service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';



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






  private location = inject(Location);
  private dialog = inject(Dialog);
  private router = inject(Router);


  openServicesSheet() {
    this.location.go(this.location.path(), '', { modalOpen: true });
  
    const dialogRef = this.dialog.open(EmplAddService, {
      panelClass: ['w-full', 'max-w-lg', 'mt-auto'],
      backdropClass: ['bg-black/50', 'backdrop-blur-sm'],
      data: ''
    });
  
    // Flag para saber si el cierre fue por el botón "Atrás" del móvil
    let closedByPopState = false;
  
    const popStateSub = this.location.subscribe(() => {
      closedByPopState = true;
      dialogRef.close();
    });
  
    dialogRef.closed.subscribe((result) => {
      popStateSub.unsubscribe();
  
      // SOLO hacemos .back() si el usuario cerró el modal manualmente (X, backdrop, cancelar)
      // Y NO mediante el botón atrás del móvil NI tras aplicar una navegación
      if (history.state?.modalOpen && !closedByPopState && result === undefined) {
        this.location.back();
      }
  
      if(typeof(result) === 'string') {
        
        this.router.navigate(['/employee/booking'], {
          queryParams: { ids: result },
        });
      }
      
    });
  }

}

