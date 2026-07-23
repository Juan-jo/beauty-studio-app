import { ChangeDetectorRef, Component, computed, EventEmitter, inject, Input, OnInit, Output, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingCalendarService } from '../../service/bokking-calendar.service';
import { CalendarDay } from '../../models/booking-calendar.models';
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

  // 4. Bandera computada para saber si se puede retroceder
  canGoPrevious = computed(() => {
    return this.yearMonth() > this.minYearMonth();
  });

  // 5. Resource nativo de Angular
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
  
    // Si es un error de Http de Angular
    if (err instanceof HttpErrorResponse) {
      /*if (err.status === 0) {
        return `Error de Conexión / CORS (Status 0): No se pudo conectar al servidor. Revisa los encabezados CORS de Spring Boot o que el teléfono pueda alcanzar la IP de la API.`;
      }*/
      return `Error HTTP ${err.status}: ${err.message || err.statusText}`;
    }
  
    // Cualquier otro tipo de error
    return typeof err === 'object' ? JSON.stringify(err) : String(err);
  });

  isLoadingCalendar = this.calendarResource.isLoading;

  daysComputed = computed(() => {
    const response = this.calendarResource.value();
    if (!response?.days) return [];
    this.buildCalendarGrid(response.days);
    return this.days;
  });

  // Signals availability

  


  nextMonth(): void {
    const [year, month] = this.yearMonth().split('-').map(Number);
    const nextDate = new Date(year, month, 1); // El mes ya viene en base 1, así que 'month' pasa al siguiente
    this.yearMonth.set(this.formatYearMonth(nextDate));
    this.selectedDay = null;
    this.selectDate.emit('');
  }

  // NAVEGACIÓN: Mes Anterior (con protección)
  prevMonth(): void {
    if (!this.canGoPrevious()) return; // Bloqueo de seguridad

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

  selectDay(day: UICalendarDay): void {
    if (day.status === 'available' && day.number) {
      this.selectedDay = day.number;

      this.selectDate.emit(this.yearMonth() + "-" + day.number.toString());

    }
  }

 
}