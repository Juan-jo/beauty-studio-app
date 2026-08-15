
import { DayOfWeek } from "../../../../core/pipes/mx-dayofweek-pipe"
import { BookingStatus } from "../../../booking/models/booking-status.model"


export interface EmployeeScheduleDay {

    bookings    : BookingDay[]

}

export interface BookingDay {

    id              : number
    status          : BookingStatus
    services        : string []
    price           : number
    start           : string
    end             : string
    duration        : number
    customer        : BookingCustomer

}


export interface BookingCustomer {
    
    name        : string
    pictureUrl  : string

}

export type EmplScheduleDayResponse = EmployeeScheduleDay;




export interface EmplWeek {
  currentDate   : string;
  week          : WeekDay[]
}

export interface WeekDay {
  date          : string
  day           : DayOfWeek
  bookings      : number
  hasPending    : boolean
  hasConfirmed  : boolean
  hasProgress   : boolean
  hasCancelled  : boolean
  hasCompleted  : boolean
  hasNoShow     : boolean


}

export type EmplWeekResponse = EmplWeek;




export interface MonthDaySchedule {
    dayNumber: number;
    date: string; // YYYY-MM-DD
    isCurrentMonth: boolean;
    isToday?: boolean;
    bookings: BookingDay[];
  }
  
  export interface MonthSchedule {
    monthName: string; // ej. "Julio 2026"
    days: MonthDaySchedule[];
  }





///

