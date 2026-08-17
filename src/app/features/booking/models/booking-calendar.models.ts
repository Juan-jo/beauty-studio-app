export type DayOfWeekName =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface CalendarDay {
  name: DayOfWeekName;
  day: number;
  available: boolean;
}

export interface CalendarAvailabilityResponse {

  yearMonth : string; // Formato "YYYY-MM" (ej: "2026-08")
  
  days      : CalendarDay[];

  services  : CalendarService[],

  total     : string
}


export interface CalendarService {

  id          : number
  name        : string
  pictureUrl  : string;
  price       : number;
  duration    : number

}