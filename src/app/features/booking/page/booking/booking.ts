import { ChangeDetectorRef, Component, computed, ElementRef, inject, OnInit, resource, signal, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { EmployeeSlot } from '../../models/employe-availability.models';
import { BookingCalendarService } from '../../service/bokking-calendar.service';
import { CommonModule } from '@angular/common';
import { BookingCalendar } from '../../component/booking-calendar/booking-calendar';
import { SelectedBeautyService } from '../../models/booking-calendar.models';

@Component({
  selector: 'app-booking',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BookingCalendar],

  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking {

  form = new FormGroup({
    serviceId: new FormControl("", [Validators.required]),
    employeeId: new FormControl("", [Validators.required]),
    date: new FormControl<number | any>(null, [Validators.required]),

    day: new FormControl<number | any>(null, [Validators.required]),
    hour: new FormControl<string>("", [Validators.required])
  })


  get f() {
    return this.form.controls;
  }

  @ViewChild('profesionalesSection') profesionalesSection!: ElementRef;
  @ViewChild('calendarSection') calendarSection!: ElementRef;


  private readonly bookingCalendarService = inject(BookingCalendarService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);


  serviceId = signal<number>(0);
  date = signal<string>('');
  beautyService = signal<SelectedBeautyService|null>(null);
  selectedEmployeeSlot = signal<EmployeeSlot|null>(null);



  isChangingProfessional = false;


  selectDate(date: string) {

    this.f.date.setValue(date);
    this.isChangingProfessional = false;
    this.selectedEmployeeSlot.set(null)

    this.date.set(date);
  }

  selectedBeautyService(beautyService: SelectedBeautyService) {
    this.beautyService.set(beautyService); 
    this.cdr.markForCheck();
  }

  centerSectionCalendar() {

    console.log('Centramos calendar');

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

  // Signal computada procesada
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

        this.cdr.markForCheck();

      }

    }, 50);






    return payload?.employees ?? [];
  });

  isLoadingAvailability = this.bookingAvailabilityResource.isLoading;




  constructor() {

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('serviceId');
      if (idParam) {
        this.serviceId.set(Number(idParam));
      }
    });
  }




  get selectedProfessional(): EmployeeSlot | undefined | null {

    return this.selectedEmployeeSlot();
    /*if (this.selectedEmployeeSlot == null) {
      return null;
    }

    return this.employeesAvailability()
      .find(p => this.selectedEmployeeSlot != null && p.id == this.selectedEmployeeSlot.id);**/
  }



  selectProfessional(p: EmployeeSlot) {

    //this.selectedEmployeeSlot = p;
    this.selectedEmployeeSlot.set(p);
    this.isChangingProfessional = false;

  }

  enableChangeProfessional() {
    this.selectedEmployeeSlot.set(null);
    this.isChangingProfessional = true;
  }


  selectHour(hour: string) {
    this.f.hour.setValue(hour)
  }


  // Helper en tu componente para filtrar rangos de horas (HH:mm)
  getSlotsByRange(slots: string[], startHour: number, endHour: number): string[] {
    return slots.filter(slot => {
      const hour = parseInt(slot.split(':')[0], 10);
      return hour >= startHour && hour < endHour;
    });
  }

  formatDuration(minutes: number): string {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    }
    return `${mins} min`;
  }
}
