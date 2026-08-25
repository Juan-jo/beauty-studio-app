import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AppConfigService } from '../../../config/app-config.service';
import { ResponseCustommerBooking } from '../models/cus-booking.models';

@Injectable({
  providedIn: 'root',
})
export class CustomerBookingService {


  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);


  private activeCountSignal = signal<number>(0);
  

    
  readonly activeCount = this.activeCountSignal.asReadonly();
  readonly hasActive = computed(() => this.activeCountSignal() > 0);
  
  private bookingTooltipSignal = signal<boolean>(false);
  readonly showBookingTooltip = this.bookingTooltipSignal.asReadonly();


  bookings(mode: 'active' | 'history', page: number, size: number) {

    return this.http.get<ResponseCustommerBooking>(`${this.appConfig.apiUrl}/api/v1/customer/bookings?viewMode=${mode}&page=${page}&size=${size}`)
  }

  createBooking(data: any) {
    return this.http.post<void>(`${this.appConfig.apiUrl}/api/v1/customer/bookings`, data)
  }

  fetchCountActiveBookings(): void {
    this.http.get<{bookingCount:number}>(`${this.appConfig.apiUrl}/api/v1/customer/bookings/actives`)
    .subscribe({
      next: (value) => {

        let bookingCount = value.bookingCount ?? 0;

        this.activeCountSignal.set(bookingCount);

        if(bookingCount > 0) {

          const hasSeenTooltip = localStorage.getItem('hasSeenBookingTooltip');
          
          if (!hasSeenTooltip) {
            
            this.bookingTooltipSignal.set(true);
          }



        }

      },
      error: (err) => console.error('Error al obtener reservaciones activas', err)
    })
  }

  dismissBookingTooltip() {
    this.bookingTooltipSignal.set(false);
    localStorage.setItem('hasSeenBookingTooltip', 'true');
  }
  
  
}
