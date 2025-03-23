import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roles } from '../../shared/model/roles';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'http://localhost:8080/api/employee_roles';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(this.apiUrl); 
  }
  
  addRoles(role:Roles): Observable<Roles>{
    return this.http.post<Roles>(this.apiUrl,role);
  }

  getRolesById(roleId : number): Observable<Roles>{
    return this.http.get<Roles>(`${this.apiUrl}/${roleId}`)
  }

  updateRoles(roleId:number, employeeRoles: Roles): Observable<Roles>{
    return this.http.put<Roles>(`${this.apiUrl}/${roleId}`,employeeRoles)
  }

  deleteRoles(roleId:number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${roleId}`)
  }
}
