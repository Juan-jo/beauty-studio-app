import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { EmplWeekSchedule } from '../components/empl-week-schedule/empl-week-schedule';
import { OpenDialogService } from '../../../shared/dialog/open-dialog';
import { EmplMonthSchedule } from '../components/empl-month-schedule/empl-month-schedule';


@Component({
  selector: 'app-empl-agenda',
  imports: [
    EmplWeekSchedule
  ],
  templateUrl: './empl-agenda.html',
  styleUrl: './empl-agenda.css',
})
export class EmplAgenda implements OnInit {
  

  @ViewChild('weekSection') weekSection!: ElementRef;
  
  private readonly openDialogService = inject(OpenDialogService);
  
  weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  setViewMonthMode() {
    
    this.openDialogService.open<any, any>(
      EmplMonthSchedule,
      {
        updateUrl: true
      }
    ).then();


  }


  ngOnInit(): void {
    setTimeout(() => {
      this.weekSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        
      });


    }, 50);
  }
 
  
}
