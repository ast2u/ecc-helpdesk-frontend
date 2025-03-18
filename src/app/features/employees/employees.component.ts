import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Employees } from '../../shared/model/employee/employees';
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeesService } from './employees.service';
import { EmployeeSearchRequest } from '../../shared/model/employee/employee-search-request';
import { PaginationComponent } from '../../shared/components/pagination/pagination-component/pagination-component';
import { Roles } from '../../shared/model/roles';
import { RolesService } from '../roles/roles.service';
import { EmployeeForm } from '../../shared/model/employee/employee-form';
import { SearchFilterModalComponent } from './search-filter-modal/search-filter-modal.component';


@Component({
  selector: 'app-employees',
  imports: [FormsModule, CommonModule, PaginationComponent, DatePipe, ReactiveFormsModule, SearchFilterModalComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  employeeList: Employees [] = [];
  availableRoles: Roles [] = [];
  isLoader: boolean = true;
  totalPages = 0;
  currentPage = 0;
  activeFilters: { key: string, label: string, value: string }[] = [];
  employeeFormAdd: FormGroup = new FormGroup({});
  employeeFormUpdate: FormGroup = new FormGroup({});
  pageSize = 10;
  searchRequest: EmployeeSearchRequest = {};

  @ViewChild(SearchFilterModalComponent) searchFilterModal!: SearchFilterModalComponent;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeesService,
    private roleService: RolesService
  ) {
    this.employeeFormAdd = EmployeeForm.createForm(this.fb);
    this.employeeFormUpdate = EmployeeForm.createForm(this.fb);
  }

  ngOnInit(): void {
    this.getEmployees();
    const addModal = document.getElementById('addEmployee');
    const updateModal = document.getElementById('updateEmployee');

    if (addModal) {
      addModal.addEventListener('hidden.bs.modal', () => {
        this.resetEmployeeForm();
      });
    }

    if (updateModal) {
      updateModal.addEventListener('hidden.bs.modal', () => {
        this.resetEmployeeForm();
      });
    }
  }
    
  editEmployee(employeeId: number){
    this.employeeFormUpdate.reset();
    this.employeeRolesArray.clear();
    this.loadRoles();
    this.employeeService.getEmployeeById(employeeId).subscribe((employee)=>{
    this.employeeFormUpdate.patchValue({
      id: employee.id,
      fullName: {
        firstName: employee.fullName.firstName,
        middleName: employee.fullName.middleName,
        lastName: employee.fullName.lastName
      },
      birthDate: employee.birthDate,
      address: {
        houseNumber: employee.address.houseNumber,
        street: employee.address.street,
        city: employee.address.city,
        zipCode: employee.address.zipCode
      },
      contactNumber: employee.contactNumber,
      employmentStatus: employee.employmentStatus
    });

    employee.employeeRoles.forEach((role: any) => {
      this.employeeRolesArray.push(new FormControl(role.id)); // ✅ Select previous roles
    });
});
  }

  onSaveUpdateEmployee(){
    if (this.employeeFormUpdate?.valid) {
      debugger
      const formData = { ...this.employeeFormUpdate.value };
      formData.employeeRoles = formData.employeeRoles.map((roleId: number) => ({ id: roleId })); // Convert IDs to objects
  
      this.employeeService.updateEmployee(formData.id, formData).subscribe({
        next: (response) => {
          console.log('Employee updated:', response);
          alert('Employee successfully updated!');
          this.getEmployees();
        },
        error: (err) => {
          console.error('Error updating employee:', err);
          alert('Failed to update employee');
        }
      });
    }
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
    return (this.employeeFormUpdate ?? this.employeeFormAdd)?.get('employeeRoles') as FormArray;
  }

  onRoleSelectionChange(event: Event, roleId: number, isUpdate: boolean = false) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const employeeRolesArray = isUpdate ? this.employeeRolesArray : this.employeeRolesArray;
  
    if (isChecked) {
      employeeRolesArray.push(new FormControl(roleId));
    } else {
      const index = employeeRolesArray.controls.findIndex(ctrl => ctrl.value === roleId);
      if (index !== -1) {
        employeeRolesArray.removeAt(index);
      }
    }
  }

  onCreateEmployee(){
    if (this.employeeFormAdd.valid) {
      const formData = { ...this.employeeFormAdd.value };
      formData.employeeRoles = formData.employeeRoles.map((roleId: number) => ({ id: roleId })); // Convert IDs to objects

      this.employeeService.addEmployee(formData).subscribe({
        next: (response) => {
          console.log('Employee added:', response);
          alert('Employee successfully added!');
          this.employeeFormAdd.reset();
          this.getEmployees();
        },
        error: (err) => {
          console.error('Error adding employee:', err);
          alert('Failed to add employee');
        }
      });
    }
  }

  addEmployeeButton(){
    this.loadRoles();
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

  confirmDelete(employeeId: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.deleteEmployee(employeeId);
    }
  }

  deleteEmployee(employeeId: number): void {
    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        alert('Employee deleted successfully!');
        this.getEmployees();
      },
      error: (err) => {
        console.error('Error deleting employee:', err);
        alert('Failed to delete employee.');
      }
    });
  }

  resetEmployeeForm(isUpdate: boolean = false) {
    if (isUpdate) {
      this.employeeFormUpdate?.reset();
      this.employeeRolesArray.clear();
    } else {
      this.employeeFormAdd?.reset();
      this.employeeRolesArray.clear();
    }
  }

  onApplyFilters(searchRequest: EmployeeSearchRequest) {
    this.searchRequest = searchRequest;
    this.currentPage = 0;
    this.getEmployees();
  }

  onRemoveFilter(key: string) {
    (this.searchRequest as any)[key] = null;
    this.getEmployees();
  }

  onClearFilters() {
    this.searchRequest = {};
    this.getEmployees();
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
