import { Component, inject, OnInit, signal } from '@angular/core';
import { ServicesService } from '../../services/services';
import { CommonModule } from '@angular/common';
import { InstallPwa } from "../../../../shared/components/install-pwa/install-pwa";
import { RouterLink } from '@angular/router';
import { Service } from '../../models/beauty.models';

@Component({
  selector: 'app-services',
  imports: [
    CommonModule,
    RouterLink,
    InstallPwa
  ],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {


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

}
