import { Component, computed, inject, LOCALE_ID, resource, signal } from '@angular/core';
import { EmplScheduleService } from './service/empl-schedule.service';
import { firstValueFrom } from 'rxjs';
import { EmplScheduleItem } from './model/empl-schedule.models';
import { MxDayOfWeekPipe } from '../../../core/pipes/mx-dayofweek-pipe';
import { DurationPipe } from '../../../core/pipes/duration-pipe';
import { TimePickerComponent } from '../../../shared/components/time-picker/time-picker';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-empl-schedule',
  imports: [
    MxDayOfWeekPipe,
    DurationPipe,
    TimePickerComponent,
    ReactiveFormsModule
  ],
  templateUrl: './empl-schedule.html',
  styleUrl: './empl-schedule.css',
  
  standalone: true
})
export class EmplSchedule {


  
  private readonly emplScheduleService = inject(EmplScheduleService);


  // Fetch Week


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


  // Update Week Hour

  showModal = false;

  formWorkingHours = signal<FormGroup>(
    this.buildFormGroup()
  );


  updateWorkingHours(data: EmplScheduleItem) {

    this.formWorkingHours.set(this.buildFormGroup(data))
    
    this.showModal = true;

  }

  

  buildFormGroup(data?: EmplScheduleItem) {

    return new FormGroup({
  
      id: new FormControl(data?.id ?? null, [
        Validators.required
      ]),
  
      startTime: new FormControl(data?.startTime ?? null, [
        Validators.required
      ]),
  
      endTime: new FormControl(data?.endTime ?? null, [
        Validators.required
      ])
  
    });  
  }

  saveWorkingHour(){

    const form = this.formWorkingHours();
  
  
    if(form.invalid){
      form.markAllAsTouched();
      return;
    }
  
  
    console.log(
      'Save-->',
      form.value
    );
  
  
   
  
    //this.showModal=false;
  
  }



}
