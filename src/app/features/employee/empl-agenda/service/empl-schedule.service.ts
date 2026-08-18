import { inject, Injectable } from '@angular/core';
import {  EmplScheduleDayResponse, EmplWeekResponse, MonthScheduleResponse } from '../model/employee-schedule.models';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../../../config/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class EmplScheduleService {


  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);



  getWeek(params: string = '') {

    return this.http.get<EmplWeekResponse>(
      `${this.config.apiUrl}/api/v1/employee/schedule/week${params}`
    );
  }



  getDaySchedule(date: string) {

    return this.http.get<EmplScheduleDayResponse>(
      `${this.config.apiUrl}/api/v1/employee/schedule/day?date=${date}`
    );
  }



  getMonth(params: string) {

    return this.http.get<MonthScheduleResponse>(
      `${this.config.apiUrl}/api/v1/employee/schedule/month${params}`
    );
  }

}
