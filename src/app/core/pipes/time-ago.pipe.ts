// time-ago.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Ahora mismo';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    
    const days = Math.floor(hours / 24);
    if (days === 1) {
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `Ayer, ${timeStr}`;
    }
    
    return date.toLocaleDateString([], { day: '2-digit', month: 'short' }) + 
           ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}