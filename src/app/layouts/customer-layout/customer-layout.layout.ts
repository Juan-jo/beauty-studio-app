import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { OpenDialogService } from '../../shared/dialog/open-dialog';
import { CusBookingsDialog } from '../../features/customer/components/cus-bookings-dialog/cus-bookings-dialog';

@Component({
  selector: 'app-customer-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
],
  templateUrl: './customer-layout.layout.html',
  styles: ``,
})
export class CustomerLayoutLayout {


  private readonly openDialogService = inject(OpenDialogService);


  isCollapsed = signal<boolean>(false);

  toggleCollapse(): void {
    this.isCollapsed.update(prev => !prev);
  }


  buildPadding() {
    return 'pb-8';

  }

  openDialogBookings() {

    this.openDialogService.open<null, null>(CusBookingsDialog, {})
    .then(response => {});

  }
  
}
