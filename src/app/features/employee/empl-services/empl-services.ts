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

  // Señal para rastrear qué IDs se están actualizando actualmente
  updatingServiceIds = signal<Set<number>>(new Set());

  serviceResource = resource({
    loader: async () => {
      return await firstValueFrom(this.emplBeautyService.getServices());
    }
  });

  // Copia/Vista computable de los servicios
  services = computed<EmplServiceItem[]>(() => {
    return this.serviceResource.value() ?? [];
  });

  isLoading = this.serviceResource.isLoading;

  onToogleService(serviceId: number, enabled: boolean) {
    // 1. Marcamos este ID en estado de "actualizando"
    this.setServiceUpdating(serviceId, true);

    // 2. Actualización Optimista Local (Actualizamos la señal interna del resource inmediatamente)
    this.serviceResource.value.update(currentServices => {
      if (!currentServices) return [];
      return currentServices.map(s => s.id === serviceId ? { ...s, enabled } : s);
    });

    // 3. Enviamos la petición PUT al backend
    this.emplBeautyService.updateService({ serviceId, enabled }).subscribe({
      next: () => {
        // Petición exitosa: quitamos el estado de carga
        this.setServiceUpdating(serviceId, false);
      },
      error: (err) => {
        console.error('Error al actualizar servicio', err);
        // Revertimos el cambio visualmente si falló el servidor
        this.serviceResource.value.update(currentServices => {
          if (!currentServices) return [];
          return currentServices.map(s => s.id === serviceId ? { ...s, enabled: !enabled } : s);
        });
        this.setServiceUpdating(serviceId, false);
      }
    });
  }

  // Helper para añadir/remover el ID del Set de actualización
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


/*export class EmplServices {

  private readonly emplBeautyService = inject(EmplBeautyService);

  serviceResource = resource({
    
    loader: async ({ }) => {
      return await firstValueFrom(
        this.emplBeautyService.getServices()
      );
    }

  });

  services = computed<EmplServiceItem[]>(() => {
    const response = this.serviceResource.value();

    return response ?? [];

  });

  isLoading = this.serviceResource.isLoading;



  onToogleService(serviceId: number, enabled: boolean) {

    this.emplBeautyService.updateService({serviceId,enabled})
    .subscribe(r=> {

    })
  }
}*/
