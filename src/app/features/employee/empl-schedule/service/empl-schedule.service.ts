
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
    ) { }


    getSchedules() {

        return this.http.get<EmplScheduleResponse>(
            `${this.config.apiUrl}/api/v1/employees/0/hours`
        );
    }

    enabledWorkHour(workingHourId: number, enabled: boolean) {

        return this.http.patch<any>(
            `${this.config.apiUrl}/api/v1/employees/0/hours/${workingHourId}/enabled`, { enabled }
        );
    }

    patcHour(workingHourId: number, data: any) {

        return this.http.patch<any>(
            `${this.config.apiUrl}/api/v1/employees/0/hours/${workingHourId}`,  data 
        );
    }


    updateBreak(breakId: number, data: any) {

        return this.http.put<any>(
            `${this.config.apiUrl}/api/v1/employees/0/break/${breakId}`,  data 
        );
    }

    createBreak(data: any) {

        return this.http.post<any>(
            `${this.config.apiUrl}/api/v1/employees/0/break`,  data 
        );
    }



}
