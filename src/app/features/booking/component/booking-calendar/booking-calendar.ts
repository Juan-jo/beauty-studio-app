import { ChangeDetectorRef, Component, computed, EventEmitter, inject, Input, OnInit, Output, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingCalendarService } from '../../service/bokking-calendar.service';
import { CalendarDay, SelectedBeautyService } from '../../models/booking-calendar.models';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

interface UICalendarDay {
  number: number | null;
  status: 'available' | 'occupied' | 'empty';
}


@Component({
  selector: 'booking-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-calendar.html'
})
export class BookingCalendar implements OnInit {


  private readonly bookingCalendarService = inject(BookingCalendarService);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly currentDate = new Date();


  @Input({ required: true }) serviceId!: number;
  @Output() selectDate = new EventEmitter<string>();
  @Output() selectedBeautyService = new EventEmitter<SelectedBeautyService>();

  @Output() centerSectionCalendar = new EventEmitter<void>();
  


  error: string = ''

  ngOnInit(): void {

  }

  weekdays = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'];
  skeletonDays = Array(35).fill(0);

  selectedDay: number | null = null;
  days: UICalendarDay[] = [];


  readonly minYearMonth = signal<string>(this.formatYearMonth(this.currentDate));

  yearMonth = signal<string>(this.formatYearMonth(this.currentDate));


  monthTitle = computed(() => {
    const [year, month] = this.yearMonth().split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    const monthName = date.toLocaleString('es-ES', { month: 'long' });

    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return `${capitalizedMonth} ${year}`;
  });

  canGoPrevious = computed(() => {
    return this.yearMonth() > this.minYearMonth();
  });

  calendarResource = resource({
    params: () => ({ yearMonth: this.yearMonth() }),
    loader: async ({ params }) => {
      return await firstValueFrom(
        this.bookingCalendarService.getDays(this.serviceId, params.yearMonth)
      );
    }
  });

  errorMessage = computed(() => {
    const err = this.calendarResource.error();
    if (!err) return null;

    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return `Error de Conexión / CORS (Status 0): No se pudo conectar al servidor. Revisa los encabezados CORS de Spring Boot o que el teléfono pueda alcanzar la IP de la API.`;
      }
    }

    return typeof err === 'object' ? JSON.stringify(err) : String(err);
  });

  isLoadingCalendar = this.calendarResource.isLoading;

  daysComputed = computed(() => {
    const response = this.calendarResource.value();

    this.selectedBeautyService.emit({
      name: response?.name ?? '',
      pictureUrl: response?.pictureUrl ?? '',
      duration: response?.duration ?? 0,
      price: response?.price ?? 0
    })

    if (!response?.days) return [];
    this.buildCalendarGrid(response.days);
    return this.days;
  });



  nextMonth(): void {
    const [year, month] = this.yearMonth().split('-').map(Number);
    const nextDate = new Date(year, month, 1);
    this.yearMonth.set(this.formatYearMonth(nextDate));
    this.selectedDay = null;
    this.selectDate.emit('');
  }

  prevMonth(): void {
    if (!this.canGoPrevious()) return;

    const [year, month] = this.yearMonth().split('-').map(Number);
    const prevDate = new Date(year, month - 2, 1); // month - 2 regresa un mes atrás
    this.yearMonth.set(this.formatYearMonth(prevDate));
    this.selectedDay = null;
    this.selectDate.emit('');
  }

  private formatYearMonth(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private buildCalendarGrid(apiDays: CalendarDay[]): void {
    if (!apiDays || !Array.isArray(apiDays) || apiDays.length === 0) {
      console.warn('apiDays está vacío o no es un arreglo válido');
      this.days = [];
      return;
    }

    const dayOffsetMap: Record<string, number> = {
      'MONDAY': 0, 'TUESDAY': 1, 'WEDNESDAY': 2, 'THURSDAY': 3,
      'FRIDAY': 4, 'SATURDAY': 5, 'SUNDAY': 6
    };

    const formattedDays: UICalendarDay[] = [];

    const firstDay = apiDays[0];
    const dayNameUpper = firstDay?.name?.toUpperCase() ?? '';
    const offset = dayOffsetMap[dayNameUpper] ?? 0;

    // Espacios en blanco para alinear el primer día
    for (let i = 0; i < offset; i++) {
      formattedDays.push({
        number: null,
        status: 'empty'
      });
    }

    // Mapeo de días
    apiDays.forEach(d => {
      formattedDays.push({
        number: d.day,
        status: d.available ? 'available' : 'occupied'
      });
    });

    this.days = [...formattedDays];
    this.cdr.markForCheck();
  }


  isCalendarExpanded = signal<boolean>(true);

  changeData() {

    this.isCalendarExpanded.set(!this.isCalendarExpanded())
    
    if(this.isCalendarExpanded()) {
      this.centerSectionCalendar.emit();
    }

    
  }

  onSelectDay(day: any) {
    if (day.status === 'occupied') return;

    this.selectedDay = day.number;
    this.selectDate.emit(this.yearMonth() + "-" + day.number.toString());

    setTimeout(() => {
      this.isCalendarExpanded.set(false);
    }, 200);
  }

  get selectedDateFormatted() {
    if (!this.selectedDay) return '';
    return `${this.selectedDay} de ${this.monthTitle()}`;
  }
  /*selectedDateFormatted = computed(() => {
    if (!this.selectedDay) return '';
    return `${this.selectedDay} de ${this.monthTitle()}`;
  });*/


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