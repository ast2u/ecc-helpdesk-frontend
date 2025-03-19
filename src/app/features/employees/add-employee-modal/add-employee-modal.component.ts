import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Roles } from '../../../shared/model/roles';

@Component({
  selector: 'app-add-employee-modal',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './add-employee-modal.component.html',
  styleUrl: './add-employee-modal.component.css'
})
export class AddEmployeeModalComponent {
  @Input() employeeFormAdd!: FormGroup;
  @Input() availableRoles: Roles[] = [];
  @Output() createEmployee = new EventEmitter<void>(); // Emit event when employee is added

  onRoleSelectionChange(event: Event, roleId: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const employeeRolesArray = this.employeeFormAdd.get('employeeRoles');
    
    if (!employeeRolesArray) return;

    if (isChecked) {
      employeeRolesArray.value.push(roleId);
    } else {
      const index = employeeRolesArray.value.indexOf(roleId);
      if (index !== -1) {
        employeeRolesArray.value.splice(index, 1);
      }
    }
  }

  onCreateEmployee() {
    this.createEmployee.emit(); // Notify the parent to create an employee
  }
}
