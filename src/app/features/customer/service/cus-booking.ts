import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '../../../config/app-config.service';
import { ResponseCustommerBooking } from '../models/cus-booking.models';

@Injectable({
  providedIn: 'root',
})
export class CustomerBookingService {


  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);


  bookings(mode: 'active' | 'history', page: number, size: number) {

    return this.http.get<ResponseCustommerBooking>(`${this.appConfig.apiUrl}/api/v1/customer/bookings?viewMode=${mode}&page=${page}&size=${size}`)
  }

  createBooking(data: any) {
    return this.http.post<void>(`${this.appConfig.apiUrl}/api/v1/customer/bookings`, data)
  }
  
  
}
