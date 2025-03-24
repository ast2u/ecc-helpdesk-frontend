import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employees } from '../model/employee/employees';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/api/employees/profile';

  getEmployeeProfile(): Observable<Employees> {
    return this.http.get<Employees>(this.apiUrl);
  }

  updateEmployeeProfile(employee: Employees): Observable<Employees> {
    return this.http.put<Employees>(`${this.apiUrl}/edit`, employee);
  }
}
