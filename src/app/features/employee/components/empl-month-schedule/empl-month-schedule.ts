import { DialogRef } from '@angular/cdk/dialog';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, computed, effect, inject, signal } from '@angular/core';
import { EmplScheduleService } from '../../empl-agenda/service/empl-schedule.service';
import { EmplScheduleDayResponse, EmplWeekResponse, MonthSchedule, MonthScheduleResponse } from '../../empl-agenda/model/employee-schedule.models';
import { DayOfWeek } from '../../../../core/pipes/mx-dayofweek-pipe';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EmplBookingCard } from '../empl-booking-card/empl-booking-card';
import { getDayStatusColor } from '../../../booking/models/booking-calendar.models';
import { EmplScheduleRefreshService } from '../../empl-agenda/service/empl-schedule-refresh.service';


interface UICalendarDay {
  number           : number | null;
  status           : 'empty' | 'valid';
  hasPending?      : boolean
  hasConfirmed?    : boolean
  hasProgress?     : boolean
  hasCancelled?    : boolean
  hasCompleted?    : boolean
  hasNoShow?       : boolean

}

@Component({
  selector: 'app-empl-month-schedule',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    EmplBookingCard
  ],
  templateUrl: './empl-month-schedule.html',
  styleUrl: './empl-month-schedule.css',
})
export class EmplMonthSchedule {

  private readonly emplScheduleService = inject(EmplScheduleService);
  private readonly cdr = inject(ChangeDetectorRef);
  private refreshService = inject(EmplScheduleRefreshService);

  yearMonth     = signal<string>('');
  selectedDate  = signal<string>('');
  currentDate    = signal<string>('');


  dialogRef = inject(DialogRef);
  isFullScreen = signal<boolean>(false);

  weekdays = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
  skeletonDays = Array(35).fill(0);

  viewMode = signal<'month'|'week'>('month');


  getDayStatusColor = getDayStatusColor;

  
  constructor() {

    
    effect(() => {
      const response = this.month();
  
      if (response?.yearMonth) {
        this.yearMonth.set(response.yearMonth);
        this.currentDate.set(response.currentDate);
        
      }

    });
      
  }

  monthResource = rxResource<MonthScheduleResponse, null>({

    stream: () => {

      let query = '';

      const yearMonth = this.yearMonth();

      
      if(yearMonth !== '') {


        query = `?yearMonth=${yearMonth}`

      }


     return this.emplScheduleService.getMonth(query)
      
    }
  });


  isLoading = this.monthResource.isLoading;


  month = computed(() =>  this.monthResource.value());


  days = computed(() => {

    const response = this.monthResource.value()

    if (!response?.days) return [];
    
    return this.buildCalendarGrid(response);
    
  });


  monthTitle = computed(() => {
    const [year, month] = this.yearMonth().split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const monthName = date.toLocaleString('es-ES', { month: 'long' });

    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${capitalizedMonth} ${year}`;
  });


  
  nextMonth(): void {
    const [year, month] = this.yearMonth().split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    this.yearMonth.set(this.formatYearMonth(nextDate));
    this.monthResource.reload();
  }

  prevMonth(): void {
    const [year, month] = this.yearMonth().split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1); // month - 2 regresa un mes atrás
    this.yearMonth.set(this.formatYearMonth(prevDate));
    this.monthResource.reload();
    
  }

  private formatYearMonth(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }


  selectDay(day: number | null) {

    this.selectedDate.set(this.yearMonth() + '-'+day)
    this.setMode('week')

  }

  changeDate(date: string) {
    this.selectedDate.set(date)

  }


  week = rxResource<EmplWeekResponse, { date: string } | undefined>({
    

    params: () => {
      const date = this.selectedDate();
      return date != '' ? { date } : undefined;
    },
  
    stream: (request) => {

      const dateStr = request.params.date;

      
  
      return this.emplScheduleService.getWeek(`?date=${dateStr}`);
    }
  });


  scheduleDayResource = rxResource<EmplScheduleDayResponse, { date: string } | undefined>({
    params: () => {

      const date = this.selectedDate();
      return date != '' ? { date } : undefined;
    },

    stream: (request) => {

      const date = request.params.date;


     return this.emplScheduleService.getDaySchedule(date);
      
    }
  });

  isLoadingScheduleDay = this.scheduleDayResource.isLoading;

  scheduleDay = computed(() => this.scheduleDayResource.value());

  reloadScheduleDayResource() {
    this.week.reload();
    this.scheduleDayResource.reload();

    this.refreshService.notifyRefresh(this.selectedDate());

  }


  setMode(mode: 'month' | 'week') {

    if(mode === 'month') {

      this.monthResource.reload();

    }

    this.viewMode.set(mode)
  }
  

  buildCalendarGrid(monthSchedule: MonthSchedule): UICalendarDay[] {



    const dayOffsetMap: Record<DayOfWeek, number> = {
      'MONDAY': 0, 'TUESDAY': 1, 'WEDNESDAY': 2, 'THURSDAY': 3,
      'FRIDAY': 4, 'SATURDAY': 5, 'SUNDAY': 6
    };

    const formattedDays: UICalendarDay[] = [];

    const offset = dayOffsetMap[monthSchedule.startDay] ?? 0;

    for (let i = 0; i < offset; i++) {
      formattedDays.push({
        number: null,
        status: 'empty'
      });
    }

    for (let day = 1; day <= monthSchedule.endMonth; day++) {

      const searhDay = monthSchedule.days.find(d => d.day == day);

      if(searhDay) {
        formattedDays.push({
          number: day,
          status: 'valid',
          hasCancelled: searhDay.hasCancelled,
          hasCompleted: searhDay.hasCompleted,
          hasConfirmed: searhDay.hasConfirmed,
          hasPending: searhDay.hasPending,
          hasProgress: searhDay.hasProgress,
          hasNoShow: searhDay.hasNoShow
        });
      }
      else {
        formattedDays.push({
          number: day,
          status: 'valid'
        });
      }

      
    }

    return [...formattedDays];

  }



  close() {
    this.dialogRef.close();
  }

  onDragEnded(event: CdkDragEnd) {
    const distanceY = event.distance.y;


    if (distanceY > 120) {
      this.close();
      return;
    }


    if (distanceY < -100) {
      this.isFullScreen.set(true);
    }

    else if (this.isFullScreen() && distanceY > 50) {
      this.isFullScreen.set(false);
    }


    event.source.reset();
  }

}
