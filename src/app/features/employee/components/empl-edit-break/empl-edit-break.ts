import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { DayOfWeek, MxDayOfWeekPipe } from '../../../../core/pipes/mx-dayofweek-pipe';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { UIState } from '../../../../core/ui/ui-state.model';
import { EmplScheduleService } from '../../empl-schedule/service/empl-schedule.service';
import { TimePickerComponent } from '../../../../shared/components/time-picker/time-picker';
import { UIStateError } from '../../../../core/ui/state-error/state-error';
import { UIStateSuccess } from "../../../../core/ui/state-success/state-success";

@Component({
  selector: 'app-empl-edit-break',
  imports: [
    TimePickerComponent,
    ReactiveFormsModule,
    MxDayOfWeekPipe,
    UIStateError,
    UIStateSuccess
],
  templateUrl: './empl-edit-break.html',
})
export class EmplEditBreak {

  private readonly cdr = inject(ChangeDetectorRef);

  public state = signal<UIState>('idle');

  dialogRef = inject(DialogRef);

  private readonly emplScheduleService = inject(EmplScheduleService);

  public readonly dataReceived = inject<EditBreak>(DIALOG_DATA, { optional: false });

  
  get day() {
    return this.dataReceived.dayOfWeek
  }

  get isEdit(): boolean {
    return !!this.dataReceived.id;
  }


  formWorkingHours = signal<FormGroup>(
    this.buildFormGroup()
  );



  isSubmitting = false;


  ngOnInit(): void {
    this.updateWorkingHours(this.dataReceived)
  }


  updateWorkingHours(data: EditBreak) {

    this.formWorkingHours.set(this.buildFormGroup(data))
    

  }

  

  buildFormGroup(data?: EditBreak) {

    return new FormGroup({
  
      id: new FormControl(data?.id ?? null, this.isEdit ? [Validators.required] : []),
  
      startTime: new FormControl(data?.startTime ?? null, [
        Validators.required
      ]),
  
      endTime: new FormControl(data?.endTime ?? null, [
        Validators.required
      ]),

      workingHourId: new FormControl(data?.workingHourId ?? null, this.isEdit ? [Validators.required] : []),
  
    });  
  }

  saveWorkingHour() {

    const form = this.formWorkingHours();
  
  
    if(form.invalid){
      form.markAllAsTouched();
      return;
    }
  
    this.isSubmitting = true;


    const req$ = this.isEdit

      ? this.emplScheduleService.updateBreak(
        form.controls['id'].value,
        form.getRawValue()
      )

      : this.emplScheduleService.createBreak(form.getRawValue())


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


export interface EditBreak {
  id?         : number
  startTime   : string
  endTime     : string
  dayOfWeek   : DayOfWeek

  workingHourId?: number
}