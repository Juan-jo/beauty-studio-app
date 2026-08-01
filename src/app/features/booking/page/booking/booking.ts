import { ChangeDetectorRef, Component, computed, ElementRef, inject, resource, signal, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, firstValueFrom } from 'rxjs';
import { EmployeeSlot } from '../../models/employe-availability.models';
import { BookingCalendarService } from '../../service/bokking-calendar.service';
import { CommonModule } from '@angular/common';
import { BookingCalendar } from '../../component/booking-calendar/booking-calendar';
import { SelectedBeautyService } from '../../models/booking-calendar.models';
import { DurationPipe } from '../../../../core/pipes/duration-pipe';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { CustomerBookingService } from '../../../customer/service/cus-booking';
import { getHomeRouteForRole } from '../../../../core/guards/role.guard';

@Component({
  selector: 'app-booking',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BookingCalendar,
    DurationPipe,
    CurrencyPipe
  ],

  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking {

  form = new FormGroup({
    serviceId: new FormControl("", [Validators.required]),
    employeeId: new FormControl<number|any>(null, [Validators.required]),
    date: new FormControl<number | any>(null, [Validators.required]),
    hour: new FormControl<string>("", [Validators.required])
  })


  get f() {
    return this.form.controls;
  }

  @ViewChild('profesionalesSection') profesionalesSection!: ElementRef;
  @ViewChild('calendarSection') calendarSection!: ElementRef;


  private readonly bookingCalendarService = inject(BookingCalendarService);
  private readonly customerBookingService = inject(CustomerBookingService);
  
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);


  serviceId = signal<number>(0);
  date = signal<string>('');
  beautyService = signal<SelectedBeautyService|null>(null);
  selectedEmployeeSlot = signal<EmployeeSlot|null>(null);


  isSubmite = signal<number>(0);


  isChangingProfessional = false;

  constructor() {

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('serviceId');
      if (idParam) {

        let serviceId = Number(idParam);

        this.serviceId.set(serviceId);
        this.setValueForm('serviceId', serviceId)
      }
    });
  }


  selectDate(date: string) {

    if(date != this.f.date.value) {
      this.startValueForm(date);

      this.date.set(date);

      this.isChangingProfessional = false;
      this.selectedEmployeeSlot.set(null)
    }
    
  }

  selectedBeautyService(beautyService: SelectedBeautyService) {
    this.beautyService.set(beautyService); 
    this.cdr.markForCheck();
  }

  centerSectionCalendar() {

    setTimeout(() => {
      this.calendarSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });


    }, 50);
  }

  bookingAvailabilityResource = resource({
    params: () => ({ date: this.date() }),
    loader: async ({ params }) => {

      if (!params.date || params.date == '') return null;

      return await firstValueFrom(
        this.bookingCalendarService.getBookingAvailibility(this.serviceId(), this.date())
      );
    }
  });


  employeesAvailability = computed<EmployeeSlot[]>(() => {
    const payload = this.bookingAvailabilityResource.value();

    const employees = payload?.employees ?? [];

    setTimeout(() => {
      this.profesionalesSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });

      if (employees.length == 1) {

        
        this.selectedEmployeeSlot.set(employees[0])
        this.isChangingProfessional = false;
        this.form.controls.employeeId.setValue(employees[0].id);

        this.cdr.markForCheck();

      }

    }, 50);


    return payload?.employees ?? [];
  });

  isLoadingAvailability = this.bookingAvailabilityResource.isLoading;



  get selectedProfessional(): EmployeeSlot | undefined | null {

    return this.selectedEmployeeSlot();
  }



  selectProfessional(p: EmployeeSlot) {

    this.selectedEmployeeSlot.set(p);
    this.isChangingProfessional = false;
    this.form.controls.employeeId.setValue(p.id)

  }

  enableChangeProfessional() {
    this.selectedEmployeeSlot.set(null);
    this.isChangingProfessional = true;
    this.setValueForm('hour', null)
  }


  selectHour(hour: string) {
    this.f.hour.setValue(hour)
    this.setValueForm('hour', hour);
  }


  // Helper en tu componente para filtrar rangos de horas (HH:mm)
  getSlotsByRange(slots: string[], startHour: number, endHour: number): string[] {
    return slots.filter(slot => {
      const hour = parseInt(slot.split(':')[0], 10);
      return hour >= startHour && hour < endHour;
    });
  }


  setValueForm(controlName: 'hour' |'employeeId' | 'serviceId', value: any) {

    this.form.get(controlName)?.setValue(value);
    this.cdr.markForCheck();

  }

  startValueForm(date: string) {

    this.f.date.setValue(date);
    this.f.employeeId.setValue(null);
    this.f.hour.setValue(null);
    
    this.cdr.markForCheck();

  }


  
  // Confirm Booking Modal


  showConfirmationModal = false;
  isSubmitting = false;
  
  // Control de respuesta 'idle' | 'success' | 'error'
  bookingStatus: 'idle' | 'success' | 'error' = 'idle';
  errorMessage = '';

  /**
   * Abre el modal de confirmación
   */
  openConfirmationModal() {
    if (this.f?.hour?.value) {
      this.bookingStatus = 'idle';
      this.errorMessage = '';
      this.showConfirmationModal = true;
    }
  }

  /**
   * Cierra el modal y resetea estados
   */
  closeConfirmationModal() {
    this.showConfirmationModal = false;
    this.bookingStatus = 'idle';
    this.isSubmitting = false;
    
  }

 
  confirmBookingSuccess() {

    this.isSubmitting = true;
    this.bookingStatus = 'idle';

    const dateTime = `${this.f.date.value} ${this.f.hour.value}`;

    const payload = {
      serviceId: this.serviceId(),
      employeeId: this.selectedProfessional?.id,
      dateTime: dateTime
    };

    

    this.customerBookingService
      .createBooking(payload)
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => {

          this.bookingStatus = 'success';
          this.cdr.markForCheck()
          

        },
        error: err => {

          this.confirmBookingError()

        }
      })

  }

 
  confirmBookingError() {

    this.isSubmitting = false;
    this.bookingStatus = 'error';
    this.errorMessage = 'El horario seleccionado ya no se encuentra disponible. Por favor elige otro horario.';
    this.cdr.markForCheck()

  }
  


  
}
