import { Component, ElementRef, Input, input, OnInit, output, signal, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-picker',
  imports: [],
  templateUrl: './image-picker.html',
  standalone: true
})
export class ImagePicker implements OnInit {
  

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  imageUrl = signal<string | null>(null);

  label = input('Agregar fotografía');

  imageSelected = output<File | null>();

  
  @Input() presentPictureUrl!: string


  get isEdit() {
    return !!this.presentPictureUrl;
  }

  openPicker() {
    this.fileInput.nativeElement.click();
  }


  onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    this.imageSelected.emit(file);


    const reader = new FileReader();

    reader.onload = () => {
      this.imageUrl.set(reader.result as string);
    };

    reader.readAsDataURL(file);
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

}
