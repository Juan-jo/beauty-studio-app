import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AppConfigService } from '../../config/app-config.service';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet],
  templateUrl: './public-layout.layout.html',
  styles: ``,
})
export class PublicLayoutLayout {

  readonly config = inject(AppConfigService);

  
}
