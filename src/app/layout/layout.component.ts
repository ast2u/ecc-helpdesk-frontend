import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterModule,RouterOutlet,CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  isAdmin: boolean = false;
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdminUser();
  }

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
