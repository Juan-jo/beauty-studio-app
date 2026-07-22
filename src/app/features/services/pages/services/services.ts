import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../../services/services';
import { CommonModule } from '@angular/common';
import { InstallPwa } from "../../../../shared/components/install-pwa/install-pwa";

@Component({
  selector: 'app-services',
  imports: [
    CommonModule,
    InstallPwa
  ],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {

  services: any[] = [];

  constructor(private service: ServicesService) {

    this.services = this.service.getAll();

  }


  ngOnInit(): void {
    this.service.getServices().subscribe(data => {
      
      console.log(data);
      
    });
  }

}
