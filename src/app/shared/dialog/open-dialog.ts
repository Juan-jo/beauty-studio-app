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

  open________________<TResult = unknown, TData = unknown>(

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



  open<TResult = unknown, TData = unknown>(
    component: ComponentType<unknown>,
    options: {
      data?: TData;
      disableClose?: boolean;
      updateUrl?: boolean;
    }
  ): Promise<TResult | undefined> {

    const updateUrl = options.updateUrl ?? true;

    if (updateUrl) {
      this.location.go(
        this.location.path(),
        '',
        {
          //...history.state,
          modalOpen: true
        }
      );
    }

    const dialogRef = this.dialog.open<TResult, TData>(
      component,
      {
        data: options.data,

        panelClass: [
          'w-full',
          'max-w-lg',
          'mt-auto'
        ],

        backdropClass: [
          'bg-black/50',
          'backdrop-blur-sm'
        ],

        disableClose: options.disableClose ?? false
      }
    );

    let closedByPopState = false;

    return new Promise<TResult | undefined>((resolve) => {

      const popStateSub = this.location.subscribe(() => {

        // El usuario presionó atrás
        closedByPopState = true;

        dialogRef.close();

      });

      dialogRef.closed.subscribe((result) => {

        popStateSub.unsubscribe();

        // El modal se cerró porque el usuario presionó atrás
        if (closedByPopState) {
          resolve(result);
          return;
        }

        // El modal se cerró manualmente
        if (
          updateUrl &&
          history.state?.modalOpen
        ) {

          // Quitamos la entrada del modal
          this.location.back();

          // Esperamos a que termine el cambio de historial
          setTimeout(() => {
            resolve(result);
          }, 50);

          return;
        }

        resolve(result);
      });

    });
  }


}

