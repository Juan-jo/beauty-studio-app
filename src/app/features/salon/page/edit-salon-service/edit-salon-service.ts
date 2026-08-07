import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImagePicker } from '../../../../shared/components/image-picker/image-picker';
import { DurationPickerComponent } from '../../../../shared/components/duration-picker/duration-picker';
import { CurrencyFormatDirective } from '../../../../core/directives/currency-format.directive';
import { AppConfigService } from '../../../../config/app-config.service';
import { SalonAdminService } from '../../service/salon-admin.service';
import { distinctUntilChanged, finalize, map } from 'rxjs';
import { UIState } from '../../../../core/ui/ui-state.model';
import { ActivatedRoute } from '@angular/router';
import { UIStateError } from '../../../../core/ui/state-error/state-error';
import { UIStateSuccess } from '../../../../core/ui/state-success/state-success';

@Component({
  selector: 'app-edit-salon-service',
  imports: [
    ReactiveFormsModule,
    ImagePicker,
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

    id: [
      '',
      Validators.required
    ],

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

    this.image.set(file);

  }


  save() {


    if (!this.isEdit && (this.form.invalid || this.image() !== null)) {

      
      this.form.markAllAsTouched();
      return;
    }
    else if(this.isEdit && this.form.invalid) {

      this.form.markAllAsTouched();
      return;
    }

    this.state.set('loading')

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
        this.form.patchValue({...data})
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

}
