import { Component, inject, OnInit } from '@angular/core';
import { EmployeeProfileService } from '../../shared/services/employee-profile.service';
import { Employees } from '../../shared/model/employee/employees';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

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
  employeeProfile!: Employees;
  isLoader: boolean = true;
  isUpdating: boolean = false;
  isEditing: boolean = false;
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
    oldPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });
  
  ngOnInit(): void {
    this.getEmployeeProfile();
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

  onChangePassword() {
    if (this.passwordForm.invalid) {
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.errorMessage = 'New passwords do not match!';
      return;
    }
    this.authService.changeProfilePassword({ oldPassword, newPassword }).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.errorMessage = '';
        this.passwordForm.reset();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error changing password';
        this.successMessage = '';
      },
      complete: () => {
        console.log('Password change request completed');
      }
    });
  }


}
