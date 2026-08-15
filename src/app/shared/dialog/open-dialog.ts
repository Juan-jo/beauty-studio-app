import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class OpenDialogService {

  private dialog = inject(Dialog);
  private location = inject(Location);

  open<TResult = unknown, TData = unknown>(

    component: ComponentType<unknown>,

    options: {

      data?: TData;

      disableClose?: boolean;

      updateUrl?: boolean;
    }
  ): Promise<TResult | undefined> {

    const updateUrl = options?.updateUrl ?? true;

    if (updateUrl) {
      this.location.go(
        this.location.path(),
        '',
        { modalOpen: true }
      );
    }

    const dialogRef = this.dialog.open<TResult, TData>(
      component,
      {
        data: options?.data,

        panelClass: ['w-full', 'max-w-lg', 'mt-auto'],
        backdropClass: ['bg-black/50', 'backdrop-blur-sm'],

        disableClose: options?.disableClose ?? false
      }
    );

    let closedByPopState = false;

    const popStateSub = this.location.subscribe(() => {
      closedByPopState = true;
      dialogRef.close();
    });

    return new Promise<TResult | undefined>((resolve) => {

      dialogRef.closed.subscribe((result) => {

        popStateSub.unsubscribe();

        if (
          updateUrl &&
          history.state?.modalOpen &&
          !closedByPopState
        ) {
          this.location.back();
        }

        resolve(result);
      });

    });
  }


}

