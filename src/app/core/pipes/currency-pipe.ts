import { inject, Pipe, PipeTransform } from '@angular/core';
import { AppConfigService } from '../../config/app-config.service';

@Pipe({
  name: 'bscurrency',
})
export class CurrencyPipe implements PipeTransform {

  private readonly config = inject(AppConfigService);

  transform(value: string | number): string {
    
    if (!value) {
      return value + '';
    };

    let amount = value;

    if(typeof(value) == 'number') {

      amount = new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2 ,
        
      }).format(value);

    }
    
    return `$${amount} ${this.config.currency}`;
  }

}
