import { Pipe, PipeTransform } from '@angular/core';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

@Pipe({
  name: 'mxDayOfWeek',
  standalone: true // Habilita el uso sin importarlo en un NgModule
})
export class MxDayOfWeekPipe implements PipeTransform {

  transform(day: DayOfWeek): string {
    const daysMap: Record<DayOfWeek, string> = {
      MONDAY: 'Lunes',
      TUESDAY: 'Martes',
      WEDNESDAY: 'Miércoles', 
      THURSDAY: 'Jueves',
      FRIDAY: 'Viernes',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo'
    };

    return daysMap[day] ?? day;
  }
}