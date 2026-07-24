
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../config/app-config.service';
import { EmplScheduleResponse } from '../model/empl-schedule.models';


@Injectable({
  providedIn: 'root'
})
export class EmplScheduleService {

  

  constructor(
    private http: HttpClient,
    private config: AppConfigService
   ){}

  
   getSchedules(){

    return this.http.get<EmplScheduleResponse>(
      `${this.config.apiUrl}/api/v1/employees/0/hours`
    );
  }



}
