
import { Dialog } from '@angular/cdk/dialog';
import { Location } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { UserUpdatePictureComponent } from '../user-update-picture';

@Injectable({
  providedIn: 'root'
})
export class UserUpdatePictureDialogService {


    private dialog = inject(Dialog);
    private location = inject(Location);

    openSheet() {
        this.location.go(this.location.path(), '', { modalOpen: true });
      
        const dialogRef = this.dialog.open(UserUpdatePictureComponent, {
          panelClass: ['w-full', 'max-w-lg', 'mt-auto'],
          backdropClass: ['bg-black/50', 'backdrop-blur-sm']
        });
      
        // Flag para saber si el cierre fue por el botón "Atrás" del móvil
        let closedByPopState = false;
      
        const popStateSub = this.location.subscribe(() => {
          closedByPopState = true;
          dialogRef.close();
        });
      
        dialogRef.closed.subscribe((result) => {
          popStateSub.unsubscribe();
      
          // SOLO hacemos .back() si el usuario cerró el modal manualmente (X, backdrop, cancelar)
          // Y NO mediante el botón atrás del móvil NI tras aplicar una navegación
          if (history.state?.modalOpen && !closedByPopState && result === undefined) {
            this.location.back();
          }
    
          
        });
      }

  
  
}