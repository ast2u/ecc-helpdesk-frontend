import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employees } from '../../shared/model/employee/employees';
import { map, Observable } from 'rxjs';
import { PaginatedResponse } from '../../shared/model/paginated-response';
import { EmployeeSearchRequest } from '../../shared/model/employee/employee-search-request';

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

  getAllEmployeesTest(): Observable<{content: Employees[]}>{
    return this.http.get<{content: Employees[]}>(this.apiUrl);
  }


}
