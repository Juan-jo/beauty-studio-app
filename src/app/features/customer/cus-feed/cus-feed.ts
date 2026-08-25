import { Component, computed, inject, resource } from '@angular/core';
import { ServicesService } from '../../services/services/services';
import { firstValueFrom } from 'rxjs';
import { BeautyServiceCard } from '../../../shared/components/beauty-service-card/beauty-service-card';
import { CustomerService } from '../service/cus-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActiveEmployees } from '../models/customer.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cus-feed',
  imports: [
    BeautyServiceCard,
    CommonModule,
    RouterLink
],
  templateUrl: './cus-feed.html',
  styleUrl: './cus-feed.css',
})
export class CusFeed {

  private readonly servicesService = inject(ServicesService);
  private readonly customerService = inject(CustomerService);


  
  servicesResource = resource({
    loader: () => firstValueFrom(this.servicesService.getServices())
  });
  
  services = computed(() => this.servicesResource.value());
  
  isLoadingServices = this.servicesResource.isLoading;


  employees = rxResource<ActiveEmployees[], null>({

    stream: () => {

     return this.customerService.activeEmployees()
      
    }
  });


}

