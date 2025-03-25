import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  loginObj: any = {
    "username": "",
    "password": ""
  }
  isLoading = false;
  
  authService = inject(AuthService)
  router = inject(Router)
  snackBar = inject(MatSnackBar);

  onLogin() {
    this.isLoading = true;
    this.authService.login(this.loginObj.username, this.loginObj.password).subscribe({
      next: (data) => {
        if (data) {
          this.showSnackbar(data.message,'success-snackbar')
          this.isLoading = false;
          this.router.navigate(['dashboard']); // Redirect to dashboard
        } else {
          this.isLoading = false;
          this.showSnackbar(data.message,'error-snackbar')
        }
      },
      error: (err) => {
        if (err.status === 401) {
          alert('Invalid username or password');
        } else {
          alert('Something went wrong. Please try again later.');
        }
      }
    });
}

private showSnackbar(message: string, panelClass: string) {
  this.snackBar.open(message, '', { 
    duration: 2000, 
    panelClass: [panelClass],
    verticalPosition: 'top'
  });
}
}
