import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AppConfigService } from '../../../config/app-config.service';
import { ResponseCustommerBooking } from '../models/cus-booking.models';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerBookingService {


  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);


  private activeCountSignal = signal<number>(0);
    
  readonly activeCount = this.activeCountSignal.asReadonly();
  readonly hasActive = computed(() => this.activeCountSignal() > 0);


  bookings(mode: 'active' | 'history', page: number, size: number) {

    return this.http.get<ResponseCustommerBooking>(`${this.appConfig.apiUrl}/api/v1/customer/bookings?viewMode=${mode}&page=${page}&size=${size}`)
  }

  createBooking(data: any) {
    return this.http.post<void>(`${this.appConfig.apiUrl}/api/v1/customer/bookings`, data)
  }

  fetchCountActiveBookings() {
    return this.http.get<{bookingCount:number}>(`${this.appConfig.apiUrl}/api/v1/customer/bookings/actives`)
    .subscribe({
      next: (value) => this.activeCountSignal.set(value.bookingCount ?? 0),
      error: (err) => console.error('Error al obtener reservaciones activas', err)
    })
  }
  
  
}
