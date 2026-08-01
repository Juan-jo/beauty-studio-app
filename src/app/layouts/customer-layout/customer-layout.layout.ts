import { Component, computed, inject, resource, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CustomerBookingService } from '../../features/customer/service/cus-booking';
import { firstValueFrom } from 'rxjs';
import { BookingDatePipe } from '../../core/pipes/booking-date.pipe';
import { DurationPipe } from '../../core/pipes/duration-pipe';
import { CurrencyPipe } from '../../core/pipes/currency-pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-customer-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CurrencyPipe,
    DurationPipe,
    BookingDatePipe,
    NgClass
],
  templateUrl: './customer-layout.layout.html',
  styles: ``,
})
export class CustomerLayoutLayout {


  isCollapsed = signal<boolean>(false);

  toggleCollapse(): void {
    this.isCollapsed.update(prev => !prev);
  }

  private readonly customerBookingService = inject(CustomerBookingService);



  bookingsResource = resource({
    loader: () => firstValueFrom(this.customerBookingService.activeBookings())
  });
  
  
  bookings = computed(() => this.bookingsResource.value());


  isLoadingBookings = this.bookingsResource.isLoading;

  buildPadding() {
    return 'pb-8';

  }
  
}
