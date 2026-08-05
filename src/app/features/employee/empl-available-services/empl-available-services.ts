import { Component, computed, EventEmitter, inject, Output, resource, signal } from '@angular/core';
import { EmplBeautyService } from '../components/empl-services/service/empl.service';
import { firstValueFrom } from 'rxjs';
import { EmplServiceItem } from '../components/empl-services/model/empl-services.models';
import { CurrencyPipe } from '../../../core/pipes/currency-pipe';
import { DurationPipe } from '../../../core/pipes/duration-pipe';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-empl-available-services',
  imports: [
    CurrencyPipe,
    DurationPipe,
    CommonModule
  ],
  templateUrl: './empl-available-services.html',
  styleUrl: './empl-available-services.css',
})
export class EmplAvailableServices {

  private readonly auth = inject(AuthService);



  
  private readonly emplBeautyService = inject(EmplBeautyService);
  
  @Output() close = new EventEmitter<void>();


  updatingServiceIds = signal<Set<number>>(new Set());



  get username() {
    return this.auth.userName;
  }

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

  closeModal() {

    this.close.emit();
  }
  

}
