import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '../../../config/app-config.service';
import { ActiveEmployeesResponse } from '../models/customer.models';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
 
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);
  

  activeEmployees() {

    return this.http.get<ActiveEmployeesResponse>(`${this.appConfig.apiUrl}/api/v1/employees/actives`)
  }


  meAuthenticated() {

    return this.http.get<any>(`${this.appConfig.apiUrl}/api/v1/customers/profile`)
  }



}
