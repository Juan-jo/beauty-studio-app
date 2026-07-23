
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../config/app-config.service';
import { CalendarAvailabilityResponse } from '../models/booking-calendar.models';
import { BookingAvailbilityPayload } from '../models/employe-availability.models';

@Injectable({
  providedIn: 'root'
})
export class BookingCalendarService {

  constructor(
    private http: HttpClient,
    private config: AppConfigService
   ){}

  
   getDays( serviceId: number, yearMonth: string) {

    const params = new HttpParams()
      .set('serviceId', serviceId)
      .set('yearMonth', yearMonth);

    return this.http.get<CalendarAvailabilityResponse>(
      `${this.config.apiUrl}/api/v1/public/salon/${this.config.salonSerial}/calendar`,
      { params }
    );

  }
    
  getBookingAvailibility( serviceId: number, date: string) {

      const params = new HttpParams()
        .set('serviceId', serviceId)
        .set('date', date);
  
      return this.http.get<BookingAvailbilityPayload>(
        `${this.config.apiUrl}/api/v1/public/salon/${this.config.salonSerial}/availability`,
        { params }
      );

  }

}