import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { UIState } from '../../../../core/ui/ui-state.model';
import { ImagePicker } from '../../../../shared/components/image-picker/image-picker';


@Component({
  selector: 'app-modal-picture-service',
  imports: [
    ImagePicker
  ],
  templateUrl: './modal-picture-service.html',
  styleUrl: './modal-picture-service.css',
})
export class ModalPictureService {



  dialogRef = inject(DialogRef);

  isCropping = signal<boolean>(false);
  
  image = signal<File | null>(null);


  errorMessage = "";


  close() {
    this.dialogRef.close();
  }

  save() {


    this.dialogRef.close(
      this.image()
    )

    
  }

  selectPicture(file: File | null) {

    this.image.set(file);
  }


  cropping(value: boolean) {
    this.isCropping.set(value)
  }


}
