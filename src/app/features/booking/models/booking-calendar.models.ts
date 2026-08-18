import { BookingStatus } from "./booking-status.model";

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






export const STATUS_COLOR_MAP = {
  pending:    'bg-amber-500',   // Naranja / Ámbar (Espera)
  confirmed:  'bg-emerald-500', // Verde Esmeralda (Confirmado)
  progress:   'bg-indigo-500',  // Violeta / Índigo (En ejecución activa)
  completed:  'bg-slate-400',   // Gris Azulado Neutral (Finalizado)
  cancelled:  'bg-rose-500',    // Rojo / Rosa Intenso (Cancelación)
  noShow:     'bg-rose-500',    // Comparte el mismo tono con Cancelled
  default:    'bg-transparent',
} as const;

export function getDayStatusColor(status: BookingStatus): string {

  switch(status) {
    case 'PENDING':
      return STATUS_COLOR_MAP.pending;

      case 'CANCELLED':
        return STATUS_COLOR_MAP.cancelled;
      
      case 'COMPLETED':
        return STATUS_COLOR_MAP.completed;
      
      case 'CONFIRMED':
        return STATUS_COLOR_MAP.confirmed;
      
      case 'IN_PROGRESS':
        return STATUS_COLOR_MAP.progress;
      
      case 'NO_SHOW':
        return STATUS_COLOR_MAP.noShow;
  }
  

  return STATUS_COLOR_MAP.default;
}