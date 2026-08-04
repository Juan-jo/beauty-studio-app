import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'ui-state-success',
  imports: [],
  templateUrl: './state-success.html'
})
export class UIStateSuccess {

  private sanitizer = inject(DomSanitizer);

  safeMessage!: SafeHtml;


  @Input({ required: true }) title!: string
  
  @Input({ required: true }) set message(val: string) {
    this.safeMessage = this.sanitizer.bypassSecurityTrustHtml(val);
  }
  @Output() close = new EventEmitter<void>();

}
