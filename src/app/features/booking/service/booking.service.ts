
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '../../../config/app-config.service';
import { Booking } from '../models/booking.models';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
   
    private readonly http = inject(HttpClient);
    private readonly config = inject(AppConfigService);


    confirm(bookingId: number) {

        return this.http.patch<void>(
            `${this.config.apiUrl}/api/v1/bookings/${bookingId}/confirm`,
            {}
        );

    }

    start(bookingId: number) {

        return this.http.patch<void>(
            `${this.config.apiUrl}/api/v1/bookings/${bookingId}/start`,
            {}
        );

    }

    complete(bookingId: number) {

        return this.http.patch<void>(
            `${this.config.apiUrl}/api/v1/bookings/${bookingId}/complete`,
            {}
        );

    }


    cancel(bookingId: number, message: string) {

        return this.http.patch<void>(
            `${this.config.apiUrl}/api/v1/bookings/${bookingId}/cancel`,
            { 'message': message }
        );

    }


    get(bookingId: number) {

        return this.http.get<Booking>(
            `${this.config.apiUrl}/api/v1/bookings/${bookingId}`,
        );

    }

}