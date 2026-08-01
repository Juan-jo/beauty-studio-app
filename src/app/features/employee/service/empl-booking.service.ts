import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '../../../config/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeBookingService {


  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);


  createBooking(data: any) {
    return this.http.post<void>(`${this.appConfig.apiUrl}/api/v1/employee/bookings`, data)
  }
  
  
}
