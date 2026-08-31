import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AppConfigService } from '../../config/app-config.service';
import { filter } from 'rxjs';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-public-layout',  
  imports: [RouterOutlet, CommonModule],
  templateUrl: './public-layout.layout.html',
  
  styles: `
  :host {
    display: block;
    min-height: 100vh;
    background-color: color-mix(in srgb, var(--color-brand-100) 50%, transparent);
  }
`
})
export class PublicLayoutLayout {

  readonly config = inject(AppConfigService);
  private location = inject(Location);
  private router = inject(Router);

  
  showBackButton = signal<boolean>(false);

  // Lista de rutas donde debe ser visible el botón de volver
  private authRoutes = ['/login', '/register', '/forgot-password', 'recovery-pwd', '/services'];

  constructor() {
    // Detecta cambios de ruta para actualizar la visibilidad del botón Back
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const isAuthRoute = this.authRoutes.some(route => event.urlAfterRedirects.endsWith(route));
        this.showBackButton.set(isAuthRoute);
      });
  }

  isMobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(prev => !prev);
  }
  goBack(): void {
    this.location.back();
  }
}
