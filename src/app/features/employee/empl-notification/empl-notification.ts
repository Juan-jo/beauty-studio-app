import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificationItem, NotificationPageResponse } from '../../../core/models/notifications.models';
import { AppConfigService } from '../../../config/app-config.service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago.pipe';
import { map } from 'rxjs';
import { BookingDatePipe } from '../../../core/pipes/booking-date.pipe';
import { UIState } from '../../../core/ui/ui-state.model';

@Component({
  selector: 'app-empl-notification',
  imports: [
    TimeAgoPipe
  ],
  providers: [BookingDatePipe],
  templateUrl: './empl-notification.html',
  styleUrl: './empl-notification.css',
})
export class EmplNotification implements OnInit {

  private http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);
  private datePipe = inject(BookingDatePipe); 

  notifications = signal<Notification[]>([]);
  currentPage = signal<number>(0);
  isLastPage = signal<boolean>(false);
  isLoading = signal<boolean>(false);



  totalCount = signal<number>(0);
  unreadCount = signal<number>(0);
  filter = signal<'ALL' | 'UNREAD'>('ALL');

  
  state = signal<UIState>('loading');

  ngOnInit(): void {
    this.loadNotifications();
  }

  transformBodyMessage(payload: { category?: NotificationCategory, [key: string]: any}) {

    
    if(payload.category === 'BOOKING_ASSIGNED') {
      

      if (payload.category === 'BOOKING_ASSIGNED') {
        
        const clientName = payload['name'] ?? '';
        const services = payload['services'] ?? '';
        const startBooking = payload['startBooking'] ?? '';

        if(clientName == '' && services == '' && startBooking == '') {
          return null;
        }
        
        
        const formattedDate = this.datePipe.transform(startBooking) 
    
        const startTime = formattedDate 
          ? ` para  <strong>${formattedDate}</strong>` 
          : '';
    
        return `<strong>${clientName}</strong> reservó <span class="text-brand-700 font-semibold">${services}</span>${startTime}.`;
      }
      
      

    }
    else if(payload.category === 'CANCELLED') {

      const clientName = payload['name'] ?? '';
      const services = payload['services'] ?? '';

        if(clientName == '' && services == '') {
          return null;
        }
        


      return `El servicio de <strong>${services}</strong> con <strong>${clientName}</strong> ha sido cancelada.`;


    }


    return null;
    


  }


  setFilter(newFilter: 'ALL' | 'UNREAD'): void {
    if (this.filter() === newFilter) return;
    this.filter.set(newFilter);
    
    // Reiniciamos paginación y lista al cambiar de filtro
    this.currentPage.set(0);
    this.notifications.set([]);
    this.isLastPage.set(false);
    this.state.set('loading')
    
    this.loadNotifications();
  }


  loadNotifications(): void {
    if (this.isLoading() || this.isLastPage()) return;
    this.isLoading.set(true);

    const unreadOnlyParam = this.filter() === 'UNREAD' ? '&unreadOnly=true' : '';

    this.http.get<NotificationPageResponse>(`${this.appConfig.apiUrl}/api/v1/notification?page=${this.currentPage()}&size=10${unreadOnlyParam}`)
      .pipe(map(res => {

        
        this.unreadCount.set(res.unreadCount)


        return new NotificationPage(

          res.isLast,

          res.content.map(it => {

            const body = this.transformBodyMessage(it.payload) ?? it.body

            const noti: Notification = {
              id: it.id,
              title: it.title,
              body: body,
              category: it.payload.category ?? '',
              read: it.read,
              createdAt: it.createdAt
            }

            return noti;
          })
        );

      }))
      .subscribe({
        next: (res) => {

          this.notifications.update(prev => [...prev, ...res.content]);
          this.isLastPage.set(res.last);
          this.currentPage.update(page => page + 1);
          this.isLoading.set(false);

          if(this.state() === 'loading') {
            this.state.set('idle')
          }

        },
        error: (err) => {
          console.error('Error al cargar notificaciones', err);
          this.isLoading.set(false);
        }
      });
  }

  getCategory(item: Notification): string {
    return item.category || 'DEFAULT';
  }

}



export type NotificationCategory =    'BOOKING_ASSIGNED' 
                                    | 'RESCHEDULED' 
                                    | 'CANCELLED'
                                    | string

interface Notification {

  id: number;
  title: string;
  body: string;
  category: NotificationCategory
  read: boolean;
  createdAt: string;

}

export class NotificationPage {

  content: Notification[];

  last: boolean;


  constructor(
    last: boolean,
    content: Notification[]

  ) {
    this.content = content;
    this.last = last
  }

}