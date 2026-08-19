import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { DialogRef } from '@angular/cdk/dialog';


interface ModalStackItem {
  dialogRef: DialogRef<any, any>;
  closedByPopState: boolean;
  updateUrl: boolean;
  closeOnHardwareBack: boolean;

}

@Injectable({
  providedIn: 'root'
})
export class OpenDialogService {

  private dialog = inject(Dialog);
  private location = inject(Location);


  private modalStack: ModalStackItem[] = [];


  constructor() {

    this.location.subscribe(() => {

      if (this.modalStack.length === 0) {
        return;
      }

      const topModal =
        this.modalStack[this.modalStack.length - 1];

      if (!topModal.updateUrl) {
        return;
      }

      topModal.closedByPopState = true;
      topModal.dialogRef.close();

    });

  }


  hasOpenModals(): boolean {
    return this.modalStack.length > 0;
  }


  closeTopModal(): boolean {

    if (this.modalStack.length === 0) {
      return false;
    }
  
    const topModal =
      this.modalStack[this.modalStack.length - 1];
  
    // Este modal NO permite Back
    if (!topModal.closeOnHardwareBack) {
      return true;
    }
  
    // Este modal sí permite Back
    if (topModal.updateUrl) {
      this.location.back();
    } else {
      topModal.dialogRef.close();
    }
  
    return true;
  }


  open<TResult = unknown, TData = unknown>(
    component: ComponentType<unknown>,
    options: {
      data?: TData;
      disableClose?: boolean;
      updateUrl?: boolean;
      closeOnHardwareBack?: boolean;

    } = {}
  ): Promise<TResult | undefined> {

    const updateUrl = options.updateUrl ?? true;
    
    const closeOnHardwareBack = options.closeOnHardwareBack ?? true;

    // Crear entrada en historial
    if (updateUrl) {

      this.location.go(
        this.location.path(),
        '',
        {
          ...history.state,
          modalOpen: true,
          stackIndex: this.modalStack.length
        }
      );

    }


    const dialogRef =
      this.dialog.open<TResult, TData>(
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

          disableClose:
            options.disableClose ?? false
        }
      );


    const stackItem: ModalStackItem = {
      dialogRef,
      closedByPopState: false,
      updateUrl,
      closeOnHardwareBack
    };


    this.modalStack.push(stackItem);


    return new Promise<TResult | undefined>((resolve) => {

      dialogRef.closed.subscribe((result) => {

        // Eliminar del stack
        const index =
          this.modalStack.indexOf(stackItem);

        if (index !== -1) {
          this.modalStack.splice(index, 1);
        }


        /*
         * El modal fue cerrado por BACK.
         *
         * La entrada del historial ya fue eliminada,
         * por lo tanto no hacemos location.back().
         */
        if (stackItem.closedByPopState) {

          resolve(result);
          return;

        }


        /*
         * El modal fue cerrado manualmente:
         *
         * X
         * backdrop
         * dialogRef.close()
         *
         * Tenemos que eliminar su entrada del historial.
         */
        if (
          stackItem.updateUrl &&
          history.state?.modalOpen
        ) {

          this.location.back();

          /*
           * Esperamos a que termine la navegación
           * antes de resolver el Promise.
           */
          setTimeout(() => {
            resolve(result);
          }, 150);

          return;

        }


        resolve(result);

      });

    });

  }

}

