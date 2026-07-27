import { inject, Injectable } from '@angular/core';
import { EmployeeScheduleDay, EmplScheduleDayResponse, EmplWeekResponse } from '../model/employee-schedule.models';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../../../config/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class EmplScheduleService {


  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);



  getWeek() {

    return this.http.get<EmplWeekResponse>(
      `${this.config.apiUrl}/api/v1/employee/schedule/week`
    );
  }



  getDaySchedule(date: string) {

    return this.http.get<EmplScheduleDayResponse>(
      `${this.config.apiUrl}/api/v1/employee/schedule/day?date=${date}`
    );
  }

}
