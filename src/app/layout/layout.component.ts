import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterModule,RouterOutlet,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isExpand = false;

  toggle() {
    this.isExpand = !this.isExpand;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('expand', this.isExpand);
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page
  }

  onClickEmployees(){
    this.router.navigate(['/employees']);
  }
}
