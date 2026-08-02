import { Component, computed, inject, LOCALE_ID, resource, signal } from '@angular/core';
import { EmplScheduleService } from './service/empl-schedule.service';
import { firstValueFrom } from 'rxjs';
import { EmplScheduleItem } from './model/empl-schedule.models';
import { MxDayOfWeekPipe } from '../../../core/pipes/mx-dayofweek-pipe';
import { DurationPipe } from '../../../core/pipes/duration-pipe';
import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import { EditScheduleHour, EmplEditScheduleHour } from '../components/empl-edit-schedule-hour/empl-edit-schedule-hour';


@Component({
  selector: 'app-empl-schedule',
  imports: [
    MxDayOfWeekPipe,
    DurationPipe
  ],
  templateUrl: './empl-schedule.html',
  
  standalone: true
})
export class EmplSchedule {


  private dialog = inject(Dialog);
  private location = inject(Location);
  
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

        this.scheduleResource.value.update(currentServices => {
          if (!currentServices) return [];
          return currentServices.map(s => s.id === scheduleId ? { ...s, enabled: !enabled } : s);
        });
        this.setWorkHourUpdating(scheduleId, false);
      }
    });

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


  
  
  editScheduleHour(item: EmplScheduleItem) {
  
    let data: EditScheduleHour = {
      id        : item.id,
      startTime : item.startTime,
      endTime   : item.endTime,
      dayOfWeek : item.dayOfWeek
    };
  
    this.location.go(this.location.path(), '', { modalOpen: true });
  
    const dialogRef = this.dialog.open(EmplEditScheduleHour, {
      data: data
    });
  
    let closedByPopState = false;
  
    // 2. Escuchamos si el usuario presiona el botón "Atrás" del teléfono
    const popStateSub = this.location.subscribe(() => {
      closedByPopState = true;
      dialogRef.close();
    });
  
    dialogRef.closed.subscribe((result) => {
      popStateSub.unsubscribe();
  
      // Si NO se cerró por el botón "Atrás" del móvil y el estado aún existe en el historial,
      // debemos hacer .back() SIEMPRE (independientemente de qué devolvió result).
      if (!closedByPopState && history.state?.modalOpen) {
        this.location.back();
      }
  
      // Lógica de negocio tras cerrar el modal
      if (result === true) {
        this.scheduleResource.reload();
      }
    });
  }



}
