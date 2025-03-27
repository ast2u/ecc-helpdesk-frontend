import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

export class EmployeeForm {
    static createForm(fb: FormBuilder): FormGroup {
        return fb.group({
          id: [''], // Keep for updates, ignored for new employees
          fullName: fb.group({
            firstName: ['' , Validators.required],
            middleName: [''],
            lastName: ['', Validators.required]
          }),
          birthDate: ['', Validators.required],
          address: fb.group({
            houseNumber: ['', Validators.required],
            street: ['', Validators.required],
            city: ['', Validators.required],
            zipCode: ['', Validators.required]
          }),
          contactNumber: ['', Validators.required],
          employmentStatus: [''],
          employeeRoles: fb.array([]) // Array of role IDs
        });
      }
}
