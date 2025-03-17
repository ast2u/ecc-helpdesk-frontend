import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Employees } from '../../shared/model/employee/employees';
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeesService } from './employees.service';
import { EmployeeSearchRequest } from '../../shared/model/employee/employee-search-request';
import { PaginationComponent } from '../../shared/components/pagination/pagination-component/pagination-component';
import { Roles } from '../../shared/model/roles';
import { RolesService } from '../roles/roles.service';


@Component({
  selector: 'app-employees',
  imports: [FormsModule, CommonModule, PaginationComponent, DatePipe, ReactiveFormsModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  employeeList: Employees [] = [];
  availableRoles: Roles [] = [];
  searchRequest: EmployeeSearchRequest = {};
  isLoader: boolean = true;
  totalPages = 0;
  activeFilters: { key: string, label: string, value: string }[] = [];
  currentPage = 0;
  pageSize = 10;
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeesService);
  private roleService = inject(RolesService);

  employeeForm: FormGroup = this.fb.group({
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
    employmentStatus: [''],
    employeeRoles: this.fb.array([])
  })

  ngOnInit(): void {
    this.getEmployees();
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles; // Store available roles
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      }
    });
  }

  get employeeRolesArray() {
    return this.employeeForm.get('employeeRoles') as FormArray;
  }

  onRoleSelectionChange(event: Event, roleId: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
  
    if (isChecked) {
      this.employeeRolesArray.push(new FormControl(roleId)); // ✅ Add role ID
    } else {
      const index = this.employeeRolesArray.controls.findIndex(ctrl => ctrl.value === roleId);
      if (index !== -1) {
        this.employeeRolesArray.removeAt(index); // ✅ Remove role ID
      }
    }
  }

  onCreateEmployee(){
    if (this.employeeForm.valid) {
      const formData = { ...this.employeeForm.value };
      formData.employeeRoles = formData.employeeRoles.map((roleId: number) => ({ id: roleId })); // Convert IDs to objects

      this.employeeService.addEmployee(formData).subscribe({
        next: (response) => {
          console.log('Employee added:', response);
          alert('Employee successfully added!');
          this.employeeForm.reset();
          this.getEmployees();
        },
        error: (err) => {
          console.error('Error adding employee:', err);
          alert('Failed to add employee');
        }
      });
    }
  }

  getEmployees() {
    this.activeFilters = this.employeeService.updateActiveFilters(this.searchRequest);
    this.employeeService.getAllEmployees(this.searchRequest, this.currentPage, this.pageSize)
      .subscribe(response => {
        this.employeeList = response.content;
        this.totalPages = response.page.totalPages;
        this.isLoader = false;
      });
  }

  updateEmployee(){
    
  }

  confirmDelete(employeeId: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.deleteEmployee(employeeId);
    }
  }

  deleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe(() => {
      this.employeeList = this.employeeList.filter(e => e.id !== employeeId);
    });
  }

  applyFilters() {
    this.searchRequest = { ...this.searchRequest };
    this.onFilterChange();
  }

  removeFilter(key: string) {
    (this.searchRequest as any)[key] = null;
    this.onFilterChange();
  }

  clearFilters() {
    this.searchRequest = {};
    this.onFilterChange();
  }

  hasActiveFilters(): boolean {
    return this.activeFilters.length > 0;
  }

  onFilterChange() {
    this.getEmployees();
  }
  
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.getEmployees();
  }
  onEntriesChange() {
    this.currentPage = 0;
    this.getEmployees();
  }

}
