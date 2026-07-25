import { Component, computed, inject, resource, signal } from '@angular/core';
import { EmplScheduleService } from './service/empl-schedule.service';
import { firstValueFrom } from 'rxjs';
import { EmplScheduleItem } from './model/empl-schedule.models';
import { MxDayOfWeekPipe } from '../../../core/pipes/mx-dayofweek-pipe';
import { DurationPipe } from '../../../core/pipes/duration-pipe';
import { BsToggleComponent } from '../../../shared/components/bs-toogle/bs-toogle';

@Component({
  selector: 'app-empl-schedule',
  imports: [
    MxDayOfWeekPipe,
    DurationPipe,
    BsToggleComponent
  ],
  templateUrl: './empl-schedule.html',
  styleUrl: './empl-schedule.css',
})
export class EmplSchedule {


  showModal = false;
  
  private readonly emplScheduleService = inject(EmplScheduleService);

  updatingWorkingHoursIds = signal<Set<number>>(new Set());


  scheduleResource = resource({
    loader: async () => {
      return await firstValueFrom(this.emplScheduleService.getSchedules());
    }
  });


  schedules = computed<EmplScheduleItem[]>(() => {
    return this.scheduleResource.value() ?? [];
  });

  isLoading = this.scheduleResource.isLoading;


  onToggleSchedule(scheduleId: number, enabled: boolean) {

    this.setWorkHourUpdating(scheduleId, true);


    this.scheduleResource.value.update(currentServices => {
      if (!currentServices) return [];
      return currentServices.map(s => s.id === scheduleId ? { ...s, enabled } : s);
    });


    this.emplScheduleService.enabledWorkHour(scheduleId, enabled).subscribe({
      next: () => {

        this.setWorkHourUpdating(scheduleId, false);
      },
      error: (err) => {
        console.error('Error al actualizar servicio', err);

        this.scheduleResource.value.update(currentServices => {
          if (!currentServices) return [];
          return currentServices.map(s => s.id === scheduleId ? { ...s, enabled: !enabled } : s);
        });
        this.setWorkHourUpdating(scheduleId, false);
      }
    });

    console.log('patch enabled', scheduleId, enabled)
  }


  private setWorkHourUpdating(id: number, isUpdating: boolean) {
    this.updatingWorkingHoursIds.update(set => {
      const newSet = new Set(set);
      if (isUpdating) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }
}
