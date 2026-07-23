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
  yearMonth: string; // Formato "YYYY-MM" (ej: "2026-08")
  name: string
  pictureUrl: string;
  price: number;
  duration: number
  
  days: CalendarDay[];
}

export interface SelectedBeautyService {

  name: string
  pictureUrl: string;
  price: number;
  duration: number

}