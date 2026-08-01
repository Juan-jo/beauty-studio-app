import { Directive, effect, inject, Input, signal, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService, UserRole } from '../services/auth';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {


  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);

  // Signal interno para reaccionar a cambios en el input de la directiva
  private requiredRoleSignal = signal<UserRole | UserRole[] | null>(null);
  private hasView = false;

  @Input() set appHasRole(role: UserRole | UserRole[]) {
    this.requiredRoleSignal.set(role);
  }

  constructor() {
    // Se ejecuta automáticamente cada vez que cambien los roles en AuthService 
    // o el valor ingresado a la directiva
    effect(() => {
      const requiredRoles = Array.isArray(this.requiredRoleSignal()) ? this.requiredRoleSignal() as UserRole[] : [this.requiredRoleSignal() as UserRole];

      if (!requiredRoles || requiredRoles.length === 0) {
        this.clearView();
        return;
      }

      const hasPermission = this.authService.hasRoles(requiredRoles);

      if (hasPermission && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasPermission && this.hasView) {
        this.clearView();
      }
    });
  }

  private clearView(): void {
    this.viewContainer.clear();
    this.hasView = false;
  }

}
