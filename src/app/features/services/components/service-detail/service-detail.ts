import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { DurationPipe } from '../../../../core/pipes/duration-pipe';
import { SalonAdminService } from '../../../salon/service/salon-admin.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-service-detail',
  imports: [
    CurrencyPipe,
    DurationPipe
  ],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.css',
})
export class ServiceDetailSheet {

  dialogRef = inject(DialogRef);


  private readonly salonAdminService = inject(SalonAdminService)
  public readonly serviceId = inject<number>(DIALOG_DATA, { optional: false });


  serviceResource = rxResource<ServiceDetail, void>({
    stream: () => this.salonAdminService.getServiceById(this.serviceId)
  });

  
  
}


interface ServiceDetail {

  id: string
  name: string
  description: string
  durationMinutes: string
  price: number
  imageUrl: string
  active: boolean
}