import { ChangeDetectorRef, Component, computed, ElementRef, inject, resource, signal, viewChild, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, firstValueFrom, Subscription } from 'rxjs';
import { EmployeeSlot } from '../../models/employe-availability.models';
import { BookingCalendarService } from '../../service/bokking-calendar.service';
import { CommonModule } from '@angular/common';
import { BookingCalendar } from '../../component/booking-calendar/booking-calendar';
import { DurationPipe } from '../../../../core/pipes/duration-pipe';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { CustomerBookingService } from '../../../customer/service/cus-booking';
import { HasRoleDirective } from '../../../../core/directives/has-role';
import { AuthService } from '../../../../core/services/auth';
import { EmployeeBookingService } from '../../../employee/service/empl-booking.service';
import { CalendarService } from '../../models/booking-calendar.models';
import { Dialog } from '@angular/cdk/dialog';
import { EmplAddService } from '../../../employee/components/empl-add-service/empl-add-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-booking',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BookingCalendar,
    DurationPipe,
    CurrencyPipe,
    HasRoleDirective
  ],

  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking {

  form = new FormGroup({
    employeeId: new FormControl<number|any>(null, [Validators.required]),
    date: new FormControl<number | any>(null, [Validators.required]),
    hour: new FormControl<string>("", [Validators.required]),

    // name & phone for role employee & salon admin
    name: new FormControl<string>(""), 
    phone: new FormControl<string>(""),

  })


  get f() {
    return this.form.controls;
  }

  @ViewChild('profesionalesSection') profesionalesSection!: ElementRef;
  @ViewChild('calendarSection') calendarSection!: ElementRef;


  private readonly bookingCalendarService = inject(BookingCalendarService);
  private readonly customerBookingService = inject(CustomerBookingService);
  private readonly employeeBookingService = inject(EmployeeBookingService);

  private authService = inject(AuthService);

  
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);
  private router = inject(Router);

  public bookingCalendar = viewChild<BookingCalendar>(BookingCalendar);


  
  date = signal<{date: string, serviceIds: string}>({date:'', serviceIds: ''});

  services = signal<CalendarService[]>([]);
  selectedEmployeeSlot = signal<EmployeeSlot|null>(null);


  isSubmite = signal<number>(0);


  isChangingProfessional = false;

  constructor() {

  }

  ngOnInit(): void {
    if(this.authService.hasRoles(['EMPLOYEE','SALON_ADMIN'])) {
      this.form.controls.name.setValidators([Validators.required]);
      this.form.controls.phone.setValidators([Validators.required]);
      this.form.controls.name.updateValueAndValidity();
      this.form.controls.phone.updateValueAndValidity();
      this.cdr.markForCheck();
    }
  }


  
  



  selectDate(date: string, serviceIds: string) {

    if(date != this.f.date.value) {
      this.startValueForm(date);

      this.date.set({
        date: date,
        serviceIds: serviceIds
      });


      this.isChangingProfessional = false;
      this.selectedEmployeeSlot.set(null)
    }
    
  }

  selectedBeautyService(services: CalendarService[]) {
    //this.beautyService.set(beautyService); 
    this.services.set(services)
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
    params: () => ({ data: this.date() }),
    loader: async ({ params }) => {

      if (!params.data.date || params.data.date == '') return null;

      return await firstValueFrom(
        this.bookingCalendarService.getBookingAvailibility(
          params.data.serviceIds,
          params.data.date
        )
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

    if(this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    const isEmployee = this.authService.hasRoles(['EMPLOYEE', 'SALON_ADMIN']);

    this.isSubmitting = true;
    this.bookingStatus = 'idle';

    const dateTime = `${this.f.date.value} ${this.f.hour.value}`;

    const payload: BookingPayload = {
      serviceIds: this.date().serviceIds,
      employeeId: this.selectedProfessional?.id,
      dateTime: dateTime,
    };


    if (isEmployee) {
      payload.name = this.f.name.value as string;
      payload.phone = this.f.phone.value as string;
    }
    
    
    const booking$ = isEmployee
      ? this.employeeBookingService.createBooking(payload)
      : this.customerBookingService.createBooking(payload);


    booking$
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
  

 
  
  private dialog = inject(Dialog);
  private location = inject(Location);



  openServicesSheet() {
    this.location.go(this.location.path(), '', { modalOpen: true });
  
    const dialogRef = this.dialog.open(EmplAddService, {
      panelClass: ['w-full', 'max-w-lg', 'mt-auto'],
      backdropClass: ['bg-black/50', 'backdrop-blur-sm'],
      data: this.services().map(i => i.id).join(',')
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
        this.changeServiceIds(result)
      }
      
    });
  }

  changeServiceIds(ids: string) {
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ids: ids }, // Pasa directamente el arreglo
      queryParamsHandling: 'merge',
      replaceUrl: true
    });

    this.f.employeeId.setValue(null);
    this.f.hour.setValue(null);
    this.f.date.setValue(null);

    
    this.selectedEmployeeSlot.set(null)

    this.executeActionOnCalendar();
    this.cdr.markForCheck();
  }

  public executeActionOnCalendar(): void {
    this.bookingCalendar()?.refreshCalendar();
  }


  
}


// 1. Definir la interfaz (puedes ponerla arriba de tu componente o en un archivo .model.ts)
interface BookingPayload {
  serviceIds: string;
  employeeId?: number;
  dateTime: string;
  name?: string;
  phone?: string;
}
