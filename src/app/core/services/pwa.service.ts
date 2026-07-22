import { Injectable, signal } from '@angular/core';
import { BeforeInstallPromptEvent } from '../models/pwa.models';

@Injectable({
  providedIn: 'root'
})
export class PwaService {

  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  readonly canInstall = signal(false);

  readonly isInstalled = signal(false);

  readonly installOutcome = signal<'accepted' | 'dismissed' | null>(null);

  constructor() {

    this.detectInstalled();

    this.listenInstallPrompt();

    this.listenInstalled();

  }

  /**
   * Detecta si ya está instalada
   */
  private detectInstalled(): void {

    const standalone = window.matchMedia('(display-mode: standalone)').matches;

    const iosStandalone = (window.navigator as any).standalone === true;

    this.isInstalled.set(standalone || iosStandalone);

  }

  /**
   * Escucha cuando el navegador permite instalar
   */
  private listenInstallPrompt(): void {

    window.addEventListener(
      'beforeinstallprompt',
      (event: Event) => {

        event.preventDefault();

        this.deferredPrompt = event as BeforeInstallPromptEvent;

        this.canInstall.set(true);

      }
    );

  }

  /**
   * Escucha cuando terminó de instalarse
   */
  private listenInstalled(): void {

    window.addEventListener(
      'appinstalled',
      () => {

        this.isInstalled.set(true);

        this.canInstall.set(false);

        this.deferredPrompt = null;

      }
    );

  }

  /**
   * Mostrar diálogo de instalación
   */
  async install(): Promise<boolean> {

    if (!this.deferredPrompt) {

      return false;

    }

    await this.deferredPrompt.prompt();

    const result = await this.deferredPrompt.userChoice;

    this.installOutcome.set(result.outcome);

    this.canInstall.set(false);

    this.deferredPrompt = null;

    return result.outcome === 'accepted';

  }

}