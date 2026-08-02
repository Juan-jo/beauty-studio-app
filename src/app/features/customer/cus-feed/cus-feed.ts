import { Component, computed, inject, resource, signal } from '@angular/core';
import { DurationPipe } from '../../../core/pipes/duration-pipe';
import { CurrencyPipe } from '../../../core/pipes/currency-pipe';
import { ServicesService } from '../../services/services/services';
import { firstValueFrom } from 'rxjs';
import { BeautyServiceCard } from '../../../shared/components/beauty-service-card/beauty-service-card';
import { CustomerBookingService } from '../service/cus-booking';
import { BookingDatePipe } from '../../../core/pipes/booking-date.pipe';

@Component({
  selector: 'app-cus-feed',
  imports: [
    BeautyServiceCard
  ],
  templateUrl: './cus-feed.html',
  styleUrl: './cus-feed.css',
})
export class CusFeed {

  private readonly servicesService = inject(ServicesService);

  private readonly customerBookingService = inject(CustomerBookingService);


  servicesResource = resource({
    loader: () => firstValueFrom(this.servicesService.getServices())
  });
  
  bookingsResource = resource({
    loader: () => firstValueFrom(this.customerBookingService.activeBookings())
  });
  
  services = computed(() => this.servicesResource.value());
  
  bookings = computed(() => this.bookingsResource.value());


  isLoadingServices = this.servicesResource.isLoading;


  isLoadingBookings = this.servicesResource.isLoading;

}

