import { Component, computed, inject, resource, signal } from '@angular/core';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { DurationPipe } from '../../../../core/pipes/duration-pipe';
import { SalonAdminService } from '../../service/salon-admin.service';
import { of, delay, firstValueFrom } from 'rxjs';
import { SalonEmployee, SalonEmployeesResponse, SalonResume, SalonServicesResponse } from '../../models/salon.models';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-salon',
  imports: [
    CurrencyPipe,
    DurationPipe,
    CommonModule
  ],
  templateUrl: './salon.html',
  styleUrl: './salon.css',
})
export class Salon {

  updatingServiceIds = signal<Set<number>>(new Set());

  private readonly auth = inject(AuthService);
  



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



  onToggleService(id: number, enabled: boolean) {
   
  }

  openServiceModal() {
    console.log('Abrir modal para crear servicio');
  }

  openSpecialistModal() {
    console.log('Abrir modal para crear especialista');
  }


  
}
