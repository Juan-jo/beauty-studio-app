import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-state-success',
  imports: [],
  templateUrl: './state-success.html'
})
export class UIStateSuccess {


  @Input({ required: true }) title!: string
  @Input({ required: true }) message!: string
  
  @Output() close = new EventEmitter<void>();

}
