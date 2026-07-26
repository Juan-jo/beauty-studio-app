import { Component, inject } from '@angular/core';
import { AppConfigService } from '../../../config/app-config.service';

@Component({
  selector: 'bs-theme',
  imports: [],
  templateUrl: './section-theme.html',
  styleUrl: './section-theme.css',
})
export class SectionTheme {

  private readonly config = inject(AppConfigService);


  get theme() {
    return this.config.theme;
  }

  changeTheme(theme: string) {
    this.config.setTheme(theme);
  }



}
