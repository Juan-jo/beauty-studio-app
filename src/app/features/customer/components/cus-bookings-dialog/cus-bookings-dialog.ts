import { DialogRef } from '@angular/cdk/dialog';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { UIState } from '../../../../core/ui/ui-state.model';
import { CustomerBookingService } from '../../service/cus-booking';
import { CustomerBooking } from '../../models/cus-booking.models';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { DurationPipe } from '../../../../core/pipes/duration-pipe';
import { BookingDatePipe } from '../../../../core/pipes/booking-date.pipe';
import { BookingStatusBadge } from '../../../booking/component/booking-status-badge/booking-status-badge';
import { OpenDialogService } from '../../../../shared/dialog/open-dialog';
import { BookingResume } from '../../../booking/component/booking-resume/booking-resume';

@Component({
  selector: 'app-cus-bookings-dialog',
  imports: [
    CommonModule,
    DragDropModule,
    MatDialogModule,
    CurrencyPipe,
    DurationPipe,
    BookingDatePipe,
    BookingStatusBadge
    
  ],
  templateUrl: './cus-bookings-dialog.html',
  styleUrl: './cus-bookings-dialog.css',
})
export class CusBookingsDialog implements OnInit {
  

  private readonly customerBookingService = inject(CustomerBookingService);
  private readonly openDialogService = inject(OpenDialogService);

  
  isFullScreen = signal<boolean>(false);
  dialogRef = inject(DialogRef);

  viewMode = signal<'active'|'history'>('active');

  currentPage = signal<number>(0);
  
  isLastPage = signal<boolean>(false);
  isLoading = signal<boolean>(false);


  bookings = signal<CustomerBooking[]>([]);

  state = signal<UIState>('loading');


  ngOnInit(): void {
    
    this.loadBookings();


  }

  loadBookings(): void {

    if (this.isLoading() || this.isLastPage()) return;


    this.isLoading.set(true);


    this.customerBookingService.bookings(this.viewMode(), this.currentPage(), 10)
     
      .subscribe({
        next: (res) => {

          this.bookings.update(prev => [...prev, ...res.content]);
          this.isLastPage.set(res.isLast);
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

  setFilter(newFilter: 'active' | 'history'): void {
    
    if (this.viewMode() === newFilter) return;
    
    this.viewMode.set(newFilter);
    
    
    this.currentPage.set(0);
    this.bookings.set([]);
    this.isLastPage.set(false);
    this.state.set('loading')
    
    this.loadBookings();

  }

  openBooking(booking: CustomerBooking) {

    this.openDialogService.open<any, number>(BookingResume, {
      data: booking.id,
      updateUrl: false
    }
    ).then(response => {});
  }



  close() {
    this.dialogRef.close();
  }

  onDragEnded(event: CdkDragEnd) {
    const distanceY = event.distance.y; // Distancia recorrida verticalmente

    // 1. Si desliza hacia abajo más de 120px -> CERRAR MODAL
    if (distanceY > 120) {
      this.close();
      return;
    }

    // 2. Si desliza hacia arriba más de 100px -> EXPANDIR A 100%
    if (distanceY < -100) {
      this.isFullScreen.set(true);
    } 
    // 3. Si estaba expandido y desliza hacia abajo un poco -> VOLVER A TAMAÑO NORMAL
    else if (this.isFullScreen() && distanceY > 50) {
      this.isFullScreen.set(false);
    }

    // Resetea la posición del drag de CDK para no distorsionar el layout
    event.source.reset();
  }
  
}
