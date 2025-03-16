import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employees } from '../../shared/model/employee/employees';
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeesService } from './employees.service';
import { EmployeeSearchRequest } from '../../shared/model/employee/employee-search-request';
import { PaginationComponent } from '../../shared/components/pagination/pagination-component/pagination-component';


@Component({
  selector: 'app-employees',
  imports: [FormsModule, CommonModule, PaginationComponent, DatePipe],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  employeeList: Employees [] = [];
  searchRequest: EmployeeSearchRequest = {};
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  constructor(private employeeService: EmployeesService){}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeService.getAllEmployees(this.searchRequest, this.currentPage, this.pageSize)
      .subscribe(response => {
        this.employeeList = response.content;
        this.totalPages = response.page.totalPages;
      });
  }

  onFilterChange() {
    this.getEmployees();
  }
  
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.getEmployees();
  }
}
