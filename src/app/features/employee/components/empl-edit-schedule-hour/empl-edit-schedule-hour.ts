import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { TimePickerComponent } from '../../../../shared/components/time-picker/time-picker';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DayOfWeek, MxDayOfWeekPipe } from '../../../../core/pipes/mx-dayofweek-pipe';
import { EmplScheduleService } from '../../empl-schedule/service/empl-schedule.service';
import { finalize } from 'rxjs';
import { UIState } from '../../../../core/ui/ui-state.model';
import { UIStateError } from '../../../../core/ui/state-error/state-error';
import { UIStateSuccess } from '../../../../core/ui/state-success/state-success';



@Component({
  selector: 'app-empl-edit-schedule-hour',
  imports: [
    TimePickerComponent,
    ReactiveFormsModule,
    MxDayOfWeekPipe,
    UIStateError,
    UIStateSuccess
  ],
  templateUrl: './empl-edit-schedule-hour.html'
})
export class EmplEditScheduleHour implements OnInit {

  
  private readonly cdr = inject(ChangeDetectorRef);

  public state = signal<UIState>('idle');

  dialogRef = inject(DialogRef);

  private readonly emplScheduleService = inject(EmplScheduleService);

  public readonly dataReceived = inject<EditScheduleHour>(DIALOG_DATA, { optional: false });

  
  get day() {
    return this.dataReceived.dayOfWeek
  }


  formWorkingHours = signal<FormGroup>(
    this.buildFormGroup()
  );



  isSubmitting = false;


  ngOnInit(): void {
    this.updateWorkingHours(this.dataReceived)
  }


  updateWorkingHours(data: EditScheduleHour) {

    this.formWorkingHours.set(this.buildFormGroup(data))
    

  }

  

  buildFormGroup(data?: EditScheduleHour) {

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
  
    this.isSubmitting = true;


    const req$ = this.emplScheduleService.patcHour(
      form.controls['id'].value,
      form.getRawValue()
    )


    req$
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => {

          this.state.set('success')
          this.cdr.markForCheck()
          

        },
        error: err => {

          this.state.set('error')
          this.cdr.markForCheck()

        }
      })

  
  }

  retry() {

    this.state.set('idle')
  }

  close(value: boolean = false) {
    this.dialogRef.close(value);
  }


}

export interface EditScheduleHour {
  id          : number
  startTime   : string
  endTime     : string
  dayOfWeek   : DayOfWeek
}
