
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../config/app-config.service';
import { ServicesResponse } from '../models/beauty.models';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(
    private http: HttpClient,
    private config: AppConfigService
  ) { }


  getServices() {
    return this.http.get<ServicesResponse>(
      `${this.config.apiUrl}/api/v1/public/salon/${this.config.salonSerial}/services`
    );
  }

  



}