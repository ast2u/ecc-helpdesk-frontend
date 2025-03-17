import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roles } from '../../shared/model/roles';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'http://localhost:8080/api/employee_roles'; // Update with your actual roles API endpoint

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(this.apiUrl); // Adjust the endpoint if necessary
  }
}
