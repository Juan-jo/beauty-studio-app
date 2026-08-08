import { Component, inject, signal } from '@angular/core';
import { ImagePicker } from '../image-picker/image-picker';
import { DialogRef } from '@angular/cdk/dialog';
import { UIStateError } from '../../../core/ui/state-error/state-error';
import { UIStateSuccess } from '../../../core/ui/state-success/state-success';
import { UIState } from '../../../core/ui/ui-state.model';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-user-update-picture',
  imports: [
    ImagePicker,
    UIStateError,
    UIStateSuccess
  ],
  templateUrl: './user-update-picture.html',
})
export class UserUpdatePictureComponent {


  private readonly authService = inject(AuthService);

  dialogRef = inject(DialogRef);

  isCropping = signal<boolean>(false);
  
  image = signal<File | null>(null);


  state = signal<UIState>('idle');
  errorMessage = "";


  close() {
    this.dialogRef.close();
  }

  save() {

    this.state.set('loading')

    const formData = new FormData();
    formData.append('file', this.image()!!);


    this.authService.updatePicture(formData)
    .subscribe({
      next: ( {pictureUrl} ) => {

        this.authService.updateUserProfilePicture(pictureUrl)

        this.state.set('success')
      },

      error: err => {

        this.errorMessage = JSON.stringify(err)

        this.state.set('error')

      }
    });

  }

  selectPicture(file: File | null) {

    this.image.set(file);
  }


  cropping(value: boolean) {
    this.isCropping.set(value)
  }


  retry() {
    this.image.set(null);
    this.state.set('idle')
  }
}
