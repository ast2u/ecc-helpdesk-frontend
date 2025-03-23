import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RolesService } from '../../shared/services/roles.service';
import { Roles } from '../../shared/model/roles';


@Component({
  selector: 'app-roles',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit {
  rolesList : Roles[] = [];
  isLoader: boolean = true;
  rolesFormAdd : FormGroup = new FormGroup({
    role_title: new FormControl(""),
    role_description: new FormControl("")
  })
  rolesFormUpdate : FormGroup = new FormGroup({
    id: new FormControl(0),
    role_title: new FormControl(""),
    role_description: new FormControl("")
  })

  constructor(private roleService: RolesService){}

  ngOnInit(): void {
    this.getEmployeeRoles();
  }

  getEmployeeRoles(){
    this.roleService.getRoles().subscribe({
      next:(roles)=>{
        this.rolesList = roles;
      },
      error: (err) => {
        console.error('Error fetching roles:', err);
      }
    });
  }

  onCreateEmployeeRoles(){
    if(this.rolesFormAdd.valid){
      const formData = {...this.rolesFormAdd.value}

      this.roleService.addRoles(formData).subscribe({
        next:(response)=>{
          console.log('Employee added:', response);
          alert('Roles successfully added!');
          this.rolesFormAdd.reset();
          this.getEmployeeRoles();
        },
        error:(err)=>{
          console.error('Error adding roles:', err);
          alert('Failed to add roles');
        }
      })
    }
  }
  editUpdateRole(roleId : number){
    this.rolesFormUpdate.reset();
    this.roleService.getRolesById(roleId).subscribe((role)=>{
      this.rolesFormUpdate.patchValue({
        id: role.id,
        role_title: role.role_title,
        role_description: role.role_description
      });
    });
  }
  saveUpdateRole(){
    if(this.rolesFormUpdate.valid){
      const formData = {... this.rolesFormUpdate.value};
      debugger
      this.roleService.updateRoles(formData.id,formData).subscribe({
        next: (response)=>{
          console.log('Employee Role updated:', response);
          alert('Employee Role successfully updated!');
          this.getEmployeeRoles();
        },
        error:(err)=>{
          console.error('Error updating employee role:', err);
          alert('Failed to update employee role');
        }
      })
    }
  }

  confirmDelete(roleId : number): void {
    if (confirm('Are you sure you want to delete this Ticket?')) {
      this.onDeleteRole(roleId);
    }
  }

  onDeleteRole(roleId : number){
    this.roleService.deleteRoles(roleId).subscribe({
      next: () => {
        alert('Role deleted successfully!');
        this.getEmployeeRoles();
      },
      error: (err) => {
        console.error('Error deleting role:', err);
        alert('Failed to delete the role.');
      }
    })
    
  }
}
