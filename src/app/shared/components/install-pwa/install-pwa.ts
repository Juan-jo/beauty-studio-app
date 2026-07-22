import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../../core/services/pwa.service';

@Component({
  selector: 'app-install-pwa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './install-pwa.html',
  styleUrl: './install-pwa.css',
})
export class InstallPwa {

  readonly pwa = inject(PwaService);

  loading = false;

  title = input('Instala Beauty Studio');

  description = input(
    'Agenda citas más rápido y recibe recordatorios.'
  );

  buttonText = input('Instalar aplicación');

  async install() {

    this.loading = true;

    try {

      await this.pwa.install();

    } finally {

      this.loading = false;

    }

  }
}
