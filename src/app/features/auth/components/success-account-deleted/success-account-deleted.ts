import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-success-account-deleted',
  imports: [],
  templateUrl: './success-account-deleted.html'
})
export class SuccessAccountDeleted {

  private readonly router = inject(Router);
  private dialoRef = inject(DialogRef)


  ok() {
    this.dialoRef.close(true);
  }

}
