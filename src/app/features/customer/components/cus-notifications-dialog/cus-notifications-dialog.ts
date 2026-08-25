import { DialogRef } from '@angular/cdk/dialog';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject, signal } from '@angular/core';
import { NotificationsContent } from '../../../../shared/components/notifications-content/notifications-content';

@Component({
  selector: 'app-cus-notifications-dialog',
  imports: [
    DragDropModule,
    NotificationsContent
  ],
  templateUrl: './cus-notifications-dialog.html',
  styleUrl: './cus-notifications-dialog.css',
})
export class CusNotificationsDialog {

  isFullScreen = signal<boolean>(false);
  dialogRef = inject(DialogRef);


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
