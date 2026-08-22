import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { getHomeRouteForRole } from '../../../core/guards/role.guard';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'bs-logout',
  imports: [CommonModule],
  templateUrl: './section-logout.html',
  styleUrl: './section-logout.css',
})
export class SectionLogout {

  isOpen = false;
  


  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);


  onConfirm() {
    this.authService.logout().subscribe(() => {


      const targetRoute = getHomeRouteForRole(['ROLE_PUBLIC']); 
      this.router.navigate([targetRoute], { replaceUrl: true });
      
    });

    
  }

}
