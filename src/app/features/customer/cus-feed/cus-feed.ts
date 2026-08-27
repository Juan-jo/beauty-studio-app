import { Component, computed, inject, resource } from '@angular/core';
import { ServicesService } from '../../services/services/services';
import { firstValueFrom } from 'rxjs';
import { BeautyServiceCard } from '../../../shared/components/beauty-service-card/beauty-service-card';
import { CustomerService } from '../service/cus-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule, Location } from '@angular/common';
import { ActiveEmployees } from '../models/customer.models';
import { Router, RouterLink } from '@angular/router';
import { OpenDialogService } from '../../../shared/dialog/open-dialog';
import { ServiceDetailSheet } from '../../services/components/service-detail/service-detail';

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

  private readonly openDialogService = inject(OpenDialogService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  

  
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


  openDetailService(serviceId: number) {


    this.openDialogService.open<number, number>(
      ServiceDetailSheet,
      {
        data: serviceId
      }
    ).then((value => {

      if(typeof(value) == 'number') {
        
        this.router.navigate(['/customer/booking'], { queryParams: { services: value }})

      }

    }))
  }


}

