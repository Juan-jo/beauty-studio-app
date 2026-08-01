import { Component, Input } from '@angular/core';
import { Service } from '../../../features/services/models/beauty.models';
import { DurationPipe } from '../../../core/pipes/duration-pipe';
import { CurrencyPipe } from '../../../core/pipes/currency-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bs-service-card',
  imports: [
    DurationPipe,
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './beauty-service-card.html',
})
export class BeautyServiceCard {

  @Input({ required: true }) service!: Service
  @Input({ required: true }) routerLink!: string [] 


}
