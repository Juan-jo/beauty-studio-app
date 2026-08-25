import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Service } from '../../../features/services/models/beauty.models';
import { CurrencyPipe } from '../../../core/pipes/currency-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bs-service-card',
  imports: [
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './beauty-service-card.html',
})
export class BeautyServiceCard {

  @Input({ required: true }) service!: Service
  @Input({ required: true }) navigation!: string [] 
  @Output() closeModal = new EventEmitter<void>();


}
