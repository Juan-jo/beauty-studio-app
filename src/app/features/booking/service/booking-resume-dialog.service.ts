
import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { BookingResume } from '../component/booking-resume/booking-resume';

@Injectable({
  providedIn: 'root'
})
export class BookingResumeDialogService {


    private dialog = inject(Dialog);
    private location = inject(Location);

    openSheet(bookingId: number) {

        this.location.go(this.location.path(), '', { modalOpen: true });
      
        const dialogRef = this.dialog.open(BookingResume, {
          panelClass: ['w-full', 'max-w-lg', 'mt-auto'],
          backdropClass: ['bg-black/50', 'backdrop-blur-sm'],
          data: bookingId
        });
      
        
        let closedByPopState = false;
      
        const popStateSub = this.location.subscribe(() => {
          closedByPopState = true;
          dialogRef.close();
        });
      
        dialogRef.closed.subscribe((result) => {
          popStateSub.unsubscribe();
      
          
          if (history.state?.modalOpen && !closedByPopState && result === undefined) {
            this.location.back();
          }
    
          
        });
      }

  
  
}