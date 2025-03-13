import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employees } from '../../shared/model/employee/employees';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employees',
  imports: [FormsModule,CommonModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  employeeList: Employees [] = [];
  employeeKeys: string[] = [];
  http = inject(HttpClient);
  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees(){
    this.http.get<{content: Employees[]}>("http://localhost:8080/api/employees").subscribe((data)=>{
      this.employeeList = data.content;

      if(this.employeeList.length > 0){
        this.employeeKeys = this.getKeys(this.employeeList[0])
      }

    });
  }
  
  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Helper function to get nested values from an object using a key path
  getNestedValue(obj: any, key: string): any {
    return key.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : ''), obj);
  }
}
