
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../config/app-config.service';
import { EmplServiceResponse } from '../model/empl-services.models';

@Injectable({
  providedIn: 'root'
})
export class EmplBeautyService {

  

  constructor(
    private http: HttpClient,
    private config: AppConfigService
   ){}

  
   getServices(){

    return this.http.get<EmplServiceResponse>(
      `${this.config.apiUrl}/api/v1/employees/0/services`
    );
  }

  updateService(data: {serviceId: number, enabled: boolean}) {
    return this.http.put<any>(
      `${this.config.apiUrl}/api/v1/employees/0/services`, data
    );
  }



}

export const headers = new HttpHeaders({ 
  'Content-Type': 'application/json'
});