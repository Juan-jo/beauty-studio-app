import { Component, computed, inject, resource, signal } from '@angular/core';
import { EmplBeautyService } from './service/empl.service';
import { firstValueFrom } from 'rxjs';
import { EmplServiceItem } from './model/empl-services.models';
import { CurrencyPipe } from '../../../core/pipes/currency-pipe';
import { DurationPipe } from '../../../core/pipes/duration-pipe';

@Component({
  selector: 'app-empl-services',
  imports: [
    CurrencyPipe,
    DurationPipe
  ],
  templateUrl: './empl-services.html',
  styleUrl: './empl-services.css',
})

export class EmplServices {
  private readonly emplBeautyService = inject(EmplBeautyService);


  updatingServiceIds = signal<Set<number>>(new Set());

  serviceResource = resource({
    loader: async () => {
      return await firstValueFrom(this.emplBeautyService.getServices());
    }
  });


  services = computed<EmplServiceItem[]>(() => {
    return this.serviceResource.value() ?? [];
  });

  isLoading = this.serviceResource.isLoading;

  onToogleService(serviceId: number, enabled: boolean) {

    this.setServiceUpdating(serviceId, true);


    this.serviceResource.value.update(currentServices => {
      if (!currentServices) return [];
      return currentServices.map(s => s.id === serviceId ? { ...s, enabled } : s);
    });


    this.emplBeautyService.updateService({ serviceId, enabled }).subscribe({
      next: () => {

        this.setServiceUpdating(serviceId, false);
      },
      error: (err) => {
        console.error('Error al actualizar servicio', err);

        this.serviceResource.value.update(currentServices => {
          if (!currentServices) return [];
          return currentServices.map(s => s.id === serviceId ? { ...s, enabled: !enabled } : s);
        });
        this.setServiceUpdating(serviceId, false);
      }
    });
  }


  private setServiceUpdating(id: number, isUpdating: boolean) {
    this.updatingServiceIds.update(set => {
      const newSet = new Set(set);
      if (isUpdating) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }
}

