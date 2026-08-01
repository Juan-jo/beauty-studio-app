import { Component, inject, signal } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { Service } from '../../../services/models/beauty.models';
import { ServicesService } from '../../../services/services/services';
import { BeautyServiceCard } from '../../../../shared/components/beauty-service-card/beauty-service-card';

@Component({
  selector: 'app-empl-select-service',
  imports: [
    BeautyServiceCard
  ],
  templateUrl: './empl-select-service.html',
  styleUrl: './empl-select-service.css',
})
export class EmplSelectService {



  private readonly beautyService = inject(ServicesService);


  isLoading = signal<boolean>(true);
  services = signal<Service[]>([]);

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    
    this.isLoading.set(true);
    
    
    this.beautyService.getServices().subscribe({
      next: (data) => {
        this.services.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
    
  }


  dialogRef = inject(DialogRef);

  close() {
    this.dialogRef.close();
  }

}
