import { Pipe, PipeTransform } from '@angular/core';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';


const DAYS: Record<DayOfWeek, { full: string; short: string }> = {
  MONDAY: { full: 'Lunes', short: 'Lun' },
  TUESDAY: { full: 'Martes', short: 'Mar' },
  WEDNESDAY: { full: 'Miércoles', short: 'Mié' },
  THURSDAY: { full: 'Jueves', short: 'Jue' },
  FRIDAY: { full: 'Viernes', short: 'Vie' },
  SATURDAY: { full: 'Sábado', short: 'Sáb' },
  SUNDAY: { full: 'Domingo', short: 'Dom' }
};

type DayFormat = 'full' | 'short';


@Pipe({
  name: 'mxDayOfWeek',
  standalone: true // Habilita el uso sin importarlo en un NgModule
})
export class MxDayOfWeekPipe implements PipeTransform {


  transform(day: DayOfWeek | null | undefined, format: DayFormat = 'full'): string {

    if (!day) {
      return '';
    }

    return DAYS[day][format];
  }

}