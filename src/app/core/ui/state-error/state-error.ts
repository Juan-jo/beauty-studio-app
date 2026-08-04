import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-state-error',
  imports: [],
  templateUrl: './state-error.html',
})
export class UIStateError {


  @Input({ required: true }) message!: string
  
  @Output() retry = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  
}
