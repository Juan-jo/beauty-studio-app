import { Component } from '@angular/core';
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
export class Services {
  services:any[]=[];

    constructor(private service:ServicesService){

        this.services=this.service.getAll();

    }

}
