import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { map, finalize } from 'rxjs';
import { AppConfigService } from '../../../config/app-config.service';
import { NotificationPageResponse } from '../../../core/models/notifications.models';
import { PushNotificationService } from '../../../core/notifications/push-notification.service';
import { BookingDatePipe } from '../../../core/pipes/booking-date.pipe';
import { UIState } from '../../../core/ui/ui-state.model';
import { BookingResume } from '../../../features/booking/component/booking-resume/booking-resume';
import { OpenDialogService } from '../../dialog/open-dialog';
import { TimeAgoPipe } from '../../../core/pipes/time-ago.pipe';

@Component({
  selector: 'app-notifications-content',
  imports: [TimeAgoPipe],
  providers: [BookingDatePipe],
  templateUrl: './notifications-content.html'
})
export class NotificationsContent implements OnInit {
  
  
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(AppConfigService);
  private readonly openDialogService = inject(OpenDialogService);
  private readonly pushNotificationService = inject(PushNotificationService);
  
  
  private datePipe = inject(BookingDatePipe); 

  notifications = signal<Notification[]>([]);
  currentPage = signal<number>(0);
  isLastPage = signal<boolean>(false);
  isLoading = signal<boolean>(false);



  totalCount = signal<number>(0);
  unreadCount = signal<number>(0);
  filter = signal<'ALL' | 'UNREAD'>('ALL');

  
  state = signal<UIState>('loading');

  markAsReading = signal<Set<number>>(new Set());



  ngOnInit(): void {
    this.loadNotifications();
  }

  transformBodyMessage(payload: { category?: NotificationCategory, [key: string]: any}) {

    const name = payload['name'] ?? '';
    const services = payload['services'] ?? '';
    const startBooking = payload['startBooking'] ?? '';

    
    if(payload.category === 'BOOKING_ASSIGNED') {
      
      if(name == '' && services == '' && startBooking == '') {
        return null;
      }
      
      
      const formattedDate = this.datePipe.transform(startBooking) 
  
      const startTime = formattedDate 
        ? ` para  <strong>${formattedDate}</strong>` 
        : '';
  
      return `<strong>${name}</strong> reservó <span class="text-brand-700 font-semibold">${services}</span>${startTime}.`;

    }
    else if(payload.category === 'CANCELLED') {

      if(name == '' && services == '') {
          return null;
      }
      

      return `El servicio de <strong>${services}</strong> con <strong>${name}</strong> ha sido cancelada.`;

    }
    else if(payload.category === 'CANCELLED_CUSTOMER') {

      if(name == '' && services == '' && startBooking == '') {
        return null;
      }
      
      
      const formattedDate = this.datePipe.transform(startBooking) 
  
      const startTime = formattedDate 
        ? ` para  <strong>${formattedDate}</strong>` 
        : '';
  
      return `Tu cita de <span class="text-brand-700 font-semibold">${services}</span> con <strong>${name}</strong>  ${startTime} ha sido cancelada.`;

    }
    else if(payload.category === 'CREATED_BOOKING') {

     

      const formattedDate = this.datePipe.transform(startBooking) 

      const startTime = formattedDate 
          ? ` para  <strong>${formattedDate}</strong>` 
          : '';
    
        return `Reservaste <span class="text-brand-700 font-semibold">${services}</span> con <strong>${name}</strong> ${startTime}.`;

    }
    else if(payload.category === 'CONFIRM_BOOKING') {

    

      const formattedDate = this.datePipe.transform(startBooking) 

      const startTime = formattedDate 
          ? ` para  <strong>${formattedDate}</strong>` 
          : '';
    
        return `Tu cita de <span class="text-brand-700 font-semibold">${services}</span> con <strong>${name}</strong> ${startTime} ha sido confirmada.`;


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

        this.pushNotificationService.setUnreadCount(res.unreadCount)
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
              createdAt: it.createdAt,
              payload: it.payload
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


  open(notification: Notification) {

    this.markAsRead(notification.id)


    switch(notification.category) {

      case 'BOOKING_ASSIGNED':
      case 'CANCELLED':
      case 'CREATED_BOOKING':
      case 'CONFIRM_BOOKING':
      case 'CANCELLED_CUSTOMER':

        this.openDialogService.open<any, number>(BookingResume, {
          data: notification.payload.bookingId,
          updateUrl: false
        }
        ).then(response => {});

        break;
    }


  }

  markAsRead(notificationId: number) {

    this.setReading(notificationId, true);


    this.notifications.update(currentServices => {
      if (!currentServices) return [];
      return currentServices.map(s => s.id === notificationId ? { ...s, read: true } : s);
    });


    this.pushNotificationService.markAsRead(notificationId)
    .pipe(
      finalize(() => this.setReading(notificationId, false))
    )
    .subscribe({
      next: (resp : any)  => {

        const { unreadCount } = resp;

        this.pushNotificationService.setUnreadCount(unreadCount)
        this.unreadCount.set(unreadCount)
      },
      error: (err) => {
        
        console.error('Error al marcar como leido', err);

        this.notifications.update(currentServices => {
          if (!currentServices) return [];
          return currentServices.map(s => s.id === notificationId ? { ...s, read: false } : s);
        });

      }
    });

  }

  private setReading(id: number, isUpdating: boolean) {
    this.markAsReading.update(set => {
      const newSet = new Set(set);
      if (isUpdating) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  }

  

}



type NotificationCategory =           'BOOKING_ASSIGNED' 
                                    | 'RESCHEDULED' 
                                    | 'CANCELLED'
                                    | 'CANCELLED_CUSTOMER'
                                    | 'CREATED_BOOKING'
                                    | 'CONFIRM_BOOKING'
                                    | 'SECURITY_CHANGE_PWD'
                                    | string

interface Notification {

  id: number;
  title: string;
  body: string;
  category: NotificationCategory
  read: boolean;
  createdAt: string;

  payload: any
}

class NotificationPage {

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