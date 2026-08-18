import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { DialogRef } from '@angular/cdk/dialog';


interface ModalStackItem {
  dialogRef: DialogRef<any, any>;
  closedByPopState: boolean;
  updateUrl: boolean;
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
      if (this.modalStack.length > 0) {
        const topModal = this.modalStack[this.modalStack.length - 1];
        topModal.closedByPopState = true;
        topModal.dialogRef.close();
      }
    });
  }

  open<TResult = unknown, TData = unknown>(
    component: ComponentType<unknown>,
    options: {
      data?: TData;
      disableClose?: boolean;
      updateUrl?: boolean;
    } = {}
  ): Promise<TResult | undefined> {

    const updateUrl = options.updateUrl ?? true;

    // Si se activa updateUrl, insertamos un nuevo estado en el historial por cada modal
    if (updateUrl) {

      this.location.go(this.location.path(), '', { modalOpen: true, stackIndex: this.modalStack.length });
    }

    const dialogRef = this.dialog.open<TResult, TData>(component, {
      data: options.data,
      panelClass: ['w-full', 'max-w-lg', 'mt-auto'],
      backdropClass: ['bg-black/50', 'backdrop-blur-sm'],
      disableClose: options.disableClose ?? false,
    });

    const stackItem: ModalStackItem = {
      dialogRef,
      closedByPopState: false,
      updateUrl,
    };

    // Apilamos el modal actual
    this.modalStack.push(stackItem);

    
    return new Promise<TResult | undefined>((resolve) => {
      dialogRef.closed.subscribe((result) => {
        // Desapilamos el modal cerrado
        const index = this.modalStack.indexOf(stackItem);
        if (index !== -1) {
          this.modalStack.splice(index, 1);
        }

        
        if (!stackItem.closedByPopState && stackItem.updateUrl) {
          this.location.back();
        }

        setTimeout(() => {
          resolve(result);
        }, 50);

        //resolve(result as TResult | undefined);
      });
    });
  }



  openCloseable<TResult = unknown, TData = unknown>(
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
          modalOpen: true,
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

