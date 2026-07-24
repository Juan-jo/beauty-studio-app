import { Component, computed, inject, resource } from '@angular/core';
import { EmplScheduleService } from './service/empl-schedule.service';
import { firstValueFrom } from 'rxjs';
import { EmplScheduleItem } from './model/empl-schedule.models';
import { MxDayOfWeekPipe } from '../../../core/pipes/mx-dayofweek-pipe';
import { DurationPipe } from '../../../core/pipes/duration-pipe';

@Component({
  selector: 'app-empl-schedule',
  imports: [
    MxDayOfWeekPipe,
    DurationPipe
  ],
  templateUrl: './empl-schedule.html',
  styleUrl: './empl-schedule.css',
})
export class EmplSchedule {


  private readonly emplScheduleService = inject(EmplScheduleService);

  scheduleResource = resource({
    loader: async () => {
      return await firstValueFrom(this.emplScheduleService.getSchedules());
    }
  });

  
  schedules = computed<EmplScheduleItem[]>(() => {
    return this.scheduleResource.value() ?? [];
  });

  isLoading = this.scheduleResource.isLoading;


}
