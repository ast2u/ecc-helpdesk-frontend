import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

export class EmployeeForm {
    static createForm(fb: FormBuilder): FormGroup {
        return fb.group({
          id: [''], // Keep for updates, ignored for new employees
          fullName: fb.group({
            firstName: [''],
            middleName: [''],
            lastName: ['']
          }),
          birthDate: [''],
          address: fb.group({
            houseNumber: [''],
            street: [''],
            city: [''],
            zipCode: ['']
          }),
          contactNumber: [''],
          employmentStatus: [''],
          employeeRoles: fb.array([]) // Array of role IDs
        });
      }
}
