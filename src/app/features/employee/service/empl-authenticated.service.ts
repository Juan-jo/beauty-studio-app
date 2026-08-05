import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '../../../config/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeAuthenticatedService {


  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);


  meAuthenticated() {
    return this.http.get<any>(`${this.appConfig.apiUrl}/api/v1/employees/me`)
  }
  
  
}
