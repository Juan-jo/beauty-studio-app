import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '../../../config/app-config.service';
import { SalonEmployeesResponse, SalonResume, SalonServicesResponse } from '../models/salon.models';

@Injectable({
  providedIn: 'root',
})
export class SalonAdminService {

  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);


  getResume() {

    return this.http.get<SalonResume>(
      `${this.config.apiUrl}/api/v1/salons/admin`,
      {}
    );

  }


  getServices() {

    return this.http.get<SalonServicesResponse>(
      `${this.config.apiUrl}/api/v1/salons/admin/services`,
      {}
    );

  }

  getEmployees() {

    return this.http.get<SalonEmployeesResponse>(
      `${this.config.apiUrl}/api/v1/salons/admin/employees`,
      {}
    );

  }




}
