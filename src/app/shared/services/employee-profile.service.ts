import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employees } from '../model/employee/employees';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {

  constructor(private http: HttpClient) { }
  private baseUrl = `${environment.apiEmployeeUrl}/profile`;

  getEmployeeProfile(): Observable<Employees> {
    return this.http.get<Employees>(this.baseUrl);
  }

  updateEmployeeProfile(employee: Employees): Observable<Employees> {
    return this.http.put<Employees>(`${this.baseUrl}/edit`, employee);
  }
}
