import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { DurationPipe } from '../../../../core/pipes/duration-pipe';
import { SalonAdminService } from '../../service/salon-admin.service';
import { SalonEmployeesResponse, SalonResume, SalonServicesResponse } from '../../models/salon.models';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule} from '@angular/common';
import { AuthService } from '../../../../core/services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-salon',
  imports: [
    CurrencyPipe,
    DurationPipe,
    CommonModule,
    RouterLink
  ],
  templateUrl: './salon.html'
})
export class Salon {

  updatingServiceIds = signal<Set<number>>(new Set());

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);


  get username() {
    return this.auth.userName;
  }



  activeTab = signal<'services' | 'specialists'>('services');


  private readonly salonAdminService = inject(SalonAdminService);
  
  resume = rxResource<SalonResume, void>({
    stream: () => this.salonAdminService.getResume()
  });

  servicesResource = rxResource<SalonServicesResponse, void>({
    stream: () => this.salonAdminService.getServices()
  });
  
  employeesResource = rxResource<SalonEmployeesResponse, void>({
    stream: () => this.salonAdminService.getEmployees()
  });


  private setUpdatingService(id: number, isUpdating: boolean) {
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


  onToggleService(id: number, enabled: boolean) {

    this.setUpdatingService(id, true);


    this.servicesResource.value.update(currentServices => {
      if (!currentServices) return [];
      return currentServices.map(s => s.serviceId === id ? { ...s, enabled } : s);
    });


    this.salonAdminService.enabledService(id, enabled).subscribe({
      next: () => {

        this.setUpdatingService(id, false);
      },
      error: (err) => {

        this.servicesResource.value.update(currentServices => {
          if (!currentServices) return [];
          return currentServices.map(s => s.serviceId === id ? { ...s, enabled: !enabled } : s);
        });

        this.setUpdatingService(id, false);
      }
    });
   
  }

  

  openSpecialistModal() {
    console.log('Abrir modal para crear especialista');
  }


  onEdit(serviceId: number) {

    this.router.navigate(['/salon/edit-salon-service'], {queryParams:{id: serviceId}})

  }



  
}
