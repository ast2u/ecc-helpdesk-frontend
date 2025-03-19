import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employees } from '../../shared/model/employee/employees';
import {Observable } from 'rxjs';
import { EmployeeSearchRequest } from '../../shared/model/searchrequest/employee-search-request';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private apiUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) { }

  getAllEmployees(searchRequest: EmployeeSearchRequest, page = 0, size = 0): Observable<{ content: Employees[], page: any }> {
    const params = this.buildParams(searchRequest, page, size);
    return this.http.get<{ content: Employees[], page: any }>(this.apiUrl, { params });
  }

  private buildParams(searchRequest: EmployeeSearchRequest, page: number, size: number): HttpParams {
    let params = new HttpParams().set('page', page).set('size', size);

    Object.entries(searchRequest).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(val => params = params.append(key, val));
        } else {
          params = params.set(key, value.toString());
        }
      }
    });

    return params;
  }

  addEmployee(employee:any): Observable<any>{
    return this.http.post(this.apiUrl,employee)
  }

  deleteEmployee(id:number): Observable<void>{
    return this.http.delete<void>(this.apiUrl+"/"+id)
  }

  updateEmployee(id:number , employee:any): Observable<any>{
    return this.http.put(this.apiUrl+"/"+id,employee)
  }

  getEmployeeById(id : number): Observable<Employees>{
    return this.http.get<Employees>(this.apiUrl+"/"+id)
  }

  updateActiveFilters(searchRequest: EmployeeSearchRequest): { key: string, label: string, value: string }[] {
    const activeFilters: { key: string, label: string, value: string }[] = [];
    
    if (searchRequest.name) {
      activeFilters.push({ key: 'name', label: 'Name', value: searchRequest.name });
    }
    if (searchRequest.status) {
      activeFilters.push({ key: 'status', label: 'Employment Status', value: searchRequest.status });
    }
    if (searchRequest.houseNumber) {
      activeFilters.push({ key: 'houseNumber', label: 'House Number', value: searchRequest.houseNumber });
    }
    if (searchRequest.street) {
      activeFilters.push({ key: 'street', label: 'Street', value: searchRequest.street });
    }
    if (searchRequest.city) {
      activeFilters.push({ key: 'city', label: 'City', value: searchRequest.city });
    }
    if (searchRequest.zipCode) {
      activeFilters.push({ key: 'zipCode', label: 'Zip Code', value: searchRequest.zipCode });
    }
    if (searchRequest.createdBy) {
      activeFilters.push({ key: 'createdBy', label: 'Created By', value: searchRequest.createdBy });
    }
    if (searchRequest.updatedBy) {
      activeFilters.push({ key: 'updatedBy', label: 'Updated By', value: searchRequest.updatedBy });
    }
    if (searchRequest.roles) {
      activeFilters.push({ key: 'roles', label: 'Roles', value: searchRequest.roles });
    }
    if(searchRequest.createdStart || searchRequest.createdEnd){
      let dateRange = `${searchRequest.createdStart}&${searchRequest.createdEnd}`;
      activeFilters.push({ key: 'createdDateRange', label: 'Created Date', value: dateRange })
    }
    if(searchRequest.updatedStart || searchRequest.updatedEnd){
      let dateRange = `${searchRequest.updatedStart}&${searchRequest.updatedEnd}`;
      activeFilters.push({key: 'updatedDatedRange', label: 'Updated Date', value: dateRange})
    }
    
    return activeFilters;
  }

}
