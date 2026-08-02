import { DIALOG_DATA, DialogRef,  } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { Service } from '../../../services/models/beauty.models';
import { ServicesService } from '../../../services/services/services';
import { CurrencyPipe } from '../../../../core/pipes/currency-pipe';
import { DurationPipe } from '../../../../core/pipes/duration-pipe';
import { CommonModule } from '@angular/common';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';


@Component({
  selector: 'empl-add-service',
  imports: [
    CurrencyPipe,
    DurationPipe,
    CommonModule,
    DragDropModule,
    MatDialogModule
  ],
  templateUrl: './empl-add-service.html',
  styleUrl: './empl-add-service.css',
})
export class EmplAddService {

  private readonly beautyService = inject(ServicesService);
  public readonly dataReceived = inject<string>(DIALOG_DATA, { optional: false });

  dialogRef = inject(DialogRef);

  isLoading = signal<boolean>(true);
  services = signal<Service[]>([]);


  public selection = new SelectionModel<number>(true, []);


  ngOnInit() {

    this.loadServices();

    const initialIds : number[] = this.dataReceived
    .split(',')
    .map((id: string) => Number(id))
    .filter((id: number) => !isNaN(id));

    this.selection.select(...initialIds);

  }

  loadServices() {
    
    this.isLoading.set(true);
    
    
    this.beautyService.getServices().subscribe({
      next: (data) => {
        this.services.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
    
  }

  toggleService(serviceId: number) {
    this.selection.toggle(serviceId);
  }

  isSelected(serviceId: number): boolean {
    return this.selection.isSelected(serviceId);
  }


  confirm() {
    this.dialogRef.close(this.selection.selected.filter(i=>i>0).join(','));
  }
  

  close() {
    this.dialogRef.close();
  }



  isFullScreen = signal<boolean>(false);

  
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
