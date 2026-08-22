import { Component, computed, inject, resource, signal } from '@angular/core';
import { ServicesService } from '../../services/services/services';
import { firstValueFrom } from 'rxjs';
import { BeautyServiceCard } from '../../../shared/components/beauty-service-card/beauty-service-card';

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

  
  servicesResource = resource({
    loader: () => firstValueFrom(this.servicesService.getServices())
  });
  
  services = computed(() => this.servicesResource.value());
  
  isLoadingServices = this.servicesResource.isLoading;


}

