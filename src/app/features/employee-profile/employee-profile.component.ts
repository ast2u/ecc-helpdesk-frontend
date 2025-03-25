import { Component, inject, OnInit } from '@angular/core';
import { EmployeeProfileService } from '../../shared/services/employee-profile.service';
import { Employees } from '../../shared/model/employee/employees';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee-profile.component.html',
  styleUrl: './employee-profile.component.css'
})
export class EmployeeProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(EmployeeProfileService);
  private authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  employeeProfile!: Employees;
  isLoader: boolean = true;
  isUpdating: boolean = false;
  isEditing: boolean = false;
  isEditingCredentials = false;
  successMessage = '';
  errorMessage = '';

  profileFormUpdate: FormGroup = this.fb.group({
    fullName: this.fb.group({
      firstName: [''],
      middleName: [''],
      lastName: ['']
    }),
    birthDate: [''],
    address: this.fb.group({
      houseNumber: [''],
      street: [''],
      city: [''],
      zipCode: ['']
    }),
    contactNumber: [''],
  });

  passwordForm: FormGroup = this.fb.group({
    username: [''],
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });
  
  ngOnInit(): void {
    this.getEmployeeProfile();
    this.passwordForm.disable();
  }

  getEmployeeProfile() {
    this.profileService.getEmployeeProfile().subscribe({
      next: (employee) => {
        this.employeeProfile = employee;
        this.isLoader = false;
      },
      error: (err) => {
        console.error('Error fetching employee profile:', err);
      }
    });
  }

  onUpdateEmployeeProfile() {
    if(this.profileFormUpdate.valid) {
      this.isUpdating = true;
      this.profileService.updateEmployeeProfile(this.profileFormUpdate.value).subscribe({
        next: (employee) => {
          this.isEditing = false;
          this.isUpdating = false;
          alert('Employee profile updated successfully!');
          this.employeeProfile = employee;
        },
        error: (err) => {
          alert('Error updating employee profile!');
          console.error('Error updating employee profile:', err);
        }
      });

    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.getEmployeeProfile();
  }

  onChangeCredentials() {
    if (this.passwordForm.invalid) {
      return;
    }
    const { username, oldPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword && newPassword !== confirmPassword) {
      this.errorMessage = 'New passwords do not match!';
      return;
    }

    const request: any = {};
    if (username) request.username = username;
    if (newPassword) {
      if (!oldPassword) {
        this.errorMessage = 'Old password is required to change password!';
        return;
      }
      request.oldPassword = oldPassword;
      request.newPassword = newPassword;
    }

    // Prevent API call if no changes are made
    if (Object.keys(request).length === 0) {
      this.errorMessage = 'No changes made!';
      return;
    }

    this.authService.changeProfileCredentials({ username, oldPassword, newPassword }).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.errorMessage = '';
        if(response.logout){
          setTimeout(()=>{
            this.showSnackbar(response.message,'success-snackbar');
            this.authService.logout();
          }, 1500);
        }else{
          setTimeout(()=>{
            this.showSnackbar(response.message,'success-snackbar');
            this.passwordForm.reset();
            this.toggleCredentialEditing();
          },1000);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error changing password';
        this.successMessage = '';
        this.toggleCredentialEditing();
      },
      complete: () => {
        console.log('Password change request completed');
      }
    });
  }

  toggleCredentialEditing(): void {
    this.isEditingCredentials = !this.isEditingCredentials;

    if (this.isEditingCredentials) {
      this.passwordForm.enable();
    } else {
      this.passwordForm.disable();
    }
  }

  private showSnackbar(message: string, panelClass: string) {
    this.snackBar.open(message, '', { 
      duration: 2000, 
      panelClass: [panelClass],
      verticalPosition: 'top'
    });
  }

}
