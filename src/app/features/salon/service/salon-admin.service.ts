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

  createService(data: any) {
    return this.http.post<any>(
      `${this.config.apiUrl}/api/v1/services`, data
    );
  }

  updateService(serviceId: number, data: any) {
    return this.http.put<any>(
      `${this.config.apiUrl}/api/v1/services/${serviceId}`, data
    );
  }

  getServiceById(serviceId: number) {
    return this.http.get<any>(
      `${this.config.apiUrl}/api/v1/services/${serviceId}`
    );
  }

  enabledService(serviceId: number, enabled: boolean) {
    return this.http.patch<any>(
      `${this.config.apiUrl}/api/v1/services/${serviceId}/enabled`, { enabled }
    );
  }



  createEmployee(data: any) {
    return this.http.post<any>(
      `${this.config.apiUrl}/api/v1/employees`, data
    );
  }

  updateEmployee(employeeId: number, data: any) {
    return this.http.put<any>(
      `${this.config.apiUrl}/api/v1/employees/${employeeId}`, data
    );
  }

  getEmployeeById(employeeId: number) {
    return this.http.get<any>(
      `${this.config.apiUrl}/api/v1/employees/${employeeId}`
    );
  }


}
