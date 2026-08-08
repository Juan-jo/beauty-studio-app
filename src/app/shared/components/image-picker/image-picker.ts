import { Component, ElementRef, EventEmitter, Input, input, OnInit, Output, output, signal, ViewChild } from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-image-picker',
  imports: [ImageCropperComponent],
  templateUrl: './image-picker.html',
  standalone: true
})
export class ImagePicker implements OnInit {
  

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  imageUrl = signal<string | null>(null);

  label = input('Agregar fotografía');

  mode = input<'service' | 'avatar'>('service');

  imageSelected = output<File | null>();


  
  @Input() presentPictureUrl!: string

  @Output() cropping = new EventEmitter<boolean>();

  get isEdit() {
    return !!this.presentPictureUrl;
  }



  isCropping = signal<boolean>(false);
  imageChangedEvent = signal<Event | null>(null);

  croppedImageBase64 = '';
  croppedBase64: string = '';




  openPicker() {
    this.fileInput.nativeElement.click();
  }


  removeImage(event: Event) {

    event.stopPropagation();

    this.imageUrl.set(null);

    this.fileInput.nativeElement.value = '';

    this.imageSelected.emit(null);
  }

  ngOnInit(): void {

    if(this.presentPictureUrl) {
      this.imageUrl.set(this.presentPictureUrl);

    }
  }

  //
  onFileSelected(event: Event): void {
    
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageChangedEvent.set(event);
      this.isCropping.set(true);
      this.cropping.emit(true)
    }

  }

  // Se dispara cada vez que el usuario mueve o escala el área de corte
  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.croppedBase64 = event.base64;
    } else if (event.objectUrl) {
      this.croppedBase64 = event.objectUrl;
    }
  }

  // Confirmar recorte
  async saveCrop() {
    if (!this.croppedBase64) return;

    let fileToEmit: File;

    if (this.croppedBase64.startsWith('data:')) {
      // Si es Base64
      fileToEmit = this.base64ToFile(this.croppedBase64, `avatar-${Date.now()}.png`);
    } else {
      // Si es una Blob Object URL
      fileToEmit = await this.urlToFile(this.croppedBase64, `avatar-${Date.now()}.png`);
    }

    // Actualizamos la vista previa local
    this.imageUrl.set(this.croppedBase64);
    
    // Emitimos el archivo al padre
    this.imageSelected.emit(fileToEmit);


    this.cropping.emit(false)
    this.isCropping.set(false);
    this.imageChangedEvent.set(null);
  }

  // 4. Cancelar recorte
  cancelCrop() {
    this.cropping.emit(false)
    this.isCropping.set(false);
    this.imageChangedEvent.set(null);
  }


  




  base64ToFile(base64Data: string, fileName: string): File {
    const arr = base64Data.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  }

  // O si ngx-image-cropper te entrega un Blob / ObjectUrl:
  async urlToFile(url: string, fileName: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  }

}
