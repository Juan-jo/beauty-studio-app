import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DurationPickerComponent } from '../../../../shared/components/duration-picker/duration-picker';
import { CurrencyFormatDirective } from '../../../../core/directives/currency-format.directive';
import { AppConfigService } from '../../../../config/app-config.service';
import { SalonAdminService } from '../../service/salon-admin.service';
import { distinctUntilChanged, finalize, map } from 'rxjs';
import { UIState } from '../../../../core/ui/ui-state.model';
import { ActivatedRoute } from '@angular/router';
import { UIStateError } from '../../../../core/ui/state-error/state-error';
import { UIStateSuccess } from '../../../../core/ui/state-success/state-success';
import { Dialog } from '@angular/cdk/dialog';
import { ModalPictureService } from '../../component/modal-picture-service/modal-picture-service';

import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-salon-service',
  imports: [
    ReactiveFormsModule,
    DurationPickerComponent,
    CurrencyFormatDirective,
    UIStateError,
    UIStateSuccess
  ],
  templateUrl: './edit-salon-service.html'
})
export class EditSalonService implements OnInit {


  public state = signal<UIState>('idle');

  isSubmitting = false;
  idService!: number;

  private dialog = inject(Dialog);
  private location = inject(Location);

  private readonly appConfig = inject(AppConfigService)
  private readonly salonAdminService = inject(SalonAdminService)
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  get currency() {
    return this.appConfig.currency;
  }

  get isEdit() {
    return !!this.idService;
  }

  image = signal<File | null>(null);
  imagePreview = signal<string | null>(null);


  currentPictureUrl!: string

  ngOnInit(): void {

    this.route.queryParams
      .pipe(
        map(params => params['id']),
        distinctUntilChanged()
      )
      .subscribe((idService: any) => {
        if (idService) {
          this.idService = idService

          this.fetchService(idService)

        }

      });

  }

  errorMessage = "";


  form = this.fb.group({

    name: [
      '',
      Validators.required
    ],

    description: [
      '',
      Validators.required
    ],

    price: [
      null,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    durationMinutes: [
      30,
      [
        Validators.required,
        Validators.min(5)
      ]
    ],


  });



  onImageChange(file: File | null) {


    if (this.imagePreview()) {
      URL.revokeObjectURL(this.imagePreview()!);
    }

    

    if (file) {
      // Creamos la URL temporal para el preview
      const previewUrl = URL.createObjectURL(file);
      this.imagePreview.set(previewUrl);
    } else {
      this.imagePreview.set(null);
    }

    this.image.set(file);

  }


  save() {


    if (!this.isEdit && (this.form.invalid || this.image() === null)) {


      this.form.markAllAsTouched();
      return;
    }
    else if (this.isEdit && this.form.invalid) {

      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();

    formData.append(
      'service',
      new Blob(
        [JSON.stringify(this.form.value)],
        { type: 'application/json' }
      )
    );

    formData.append('image', this.image()!!);


    const req$ = this.isEdit
      ? this.salonAdminService.updateService(this.idService, formData)
      : this.salonAdminService.createService(formData)


    req$
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => {

          this.state.set('success')
          this.cdr.markForCheck()


        },
        error: err => {

          this.state.set('error')
          this.cdr.markForCheck()

        }
      })



  }



  fetchService(servieId: number) {

    this.state.set('loading')



    this.salonAdminService.getServiceById(servieId)
      .pipe(
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: (data) => {


          let { imageUrl } = data;

          this.currentPictureUrl = imageUrl;
          this.form.patchValue({ ...data })
          this.state.set('idle')
          this.cdr.markForCheck()


        },
        error: err => {

          this.state.set('error')
          this.cdr.markForCheck()

        }
      })


  }

  onClose() {
    history.back();
  }

  retry() {
    this.state.set('idle')
  }








  openSheet() {
    this.location.go(this.location.path(), '', { modalOpen: true });

    const dialogRef = this.dialog.open(ModalPictureService, {
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


      console.log('resul modal -->', result)


      if(result) {
        this.onImageChange(result as File)
        this.location.back();
      }
        

      // SOLO hacemos .back() si el usuario cerró el modal manualmente (X, backdrop, cancelar)
      // Y NO mediante el botón atrás del móvil NI tras aplicar una navegación
      if (history.state?.modalOpen && !closedByPopState && result === undefined) {
        this.location.back();
      }


    });
  }


}
