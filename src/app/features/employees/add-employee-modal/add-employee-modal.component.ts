import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeesService } from '../employees.service';
import { RolesService } from '../../roles/roles.service';

@Component({
  selector: 'app-add-employee-modal',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './add-employee-modal.component.html',
  styleUrl: './add-employee-modal.component.css'
})
export class AddEmployeeModalComponent {
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() employeeAdded = new EventEmitter<void>();

  employeeFormAdd: FormGroup;
  availableRoles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeesService,
    private roleService: RolesService
  ) {
    this.employeeFormAdd = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      fullName: this.fb.group({
        firstName: [''],
        middleName: [''],
        lastName: ['']
      }),
      birthDate: [''],
      contactNumber: [''],
      address: this.fb.group({
        houseNumber: [''],
        street: [''],
        city: [''],
        zipCode: ['']
      }),
      employmentStatus: ['FULL_TIME'],
      employeeRoles: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.availableRoles = roles;
      },
      error: (err) => console.error('Error fetching roles:', err)
    });
  }

  get employeeRolesArray(): FormArray {
    return this.employeeFormAdd.get('employeeRoles') as FormArray;
  }

  onRoleSelectionChange(event: Event, roleId: number) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.employeeRolesArray.push(new FormControl(roleId));
    } else {
      const index = this.employeeRolesArray.controls.findIndex(ctrl => ctrl.value === roleId);
      if (index !== -1) {
        this.employeeRolesArray.removeAt(index);
      }
    }
  }

  onCreateEmployee() {
    if (this.employeeFormAdd.valid) {
      const formData = { ...this.employeeFormAdd.value };
      formData.employeeRoles = formData.employeeRoles.map((roleId: number) => ({ id: roleId }));

      this.employeeService.addEmployee(formData).subscribe({
        next: () => {
          alert('Employee successfully added!');
          this.employeeFormAdd.reset();
          this.employeeRolesArray.clear();
          this.employeeAdded.emit(); // Notify parent to refresh list
          this.closeModal.emit(); // Close modal
        },
        error: (err) => {
          console.error('Error adding employee:', err);
          alert('Failed to add employee');
        }
      });
    }
  }
}
