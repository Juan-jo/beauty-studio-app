import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmplScheduleRefreshService {
  

    /*private readonly refreshTrigger = signal<string>('');

    readonly refresh = this.refreshTrigger.asReadonly();

    notifyRefresh(date: string): void {
        this.refreshTrigger.set(date);
    }*/

    private refreshSubject = new Subject<string>();
    readonly refresh$ = this.refreshSubject.asObservable();

    notifyRefresh(date: string): void {
        this.refreshSubject.next(date);
    }

}