import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Roles } from '../../shared/model/roles';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(environment.apiRolesUrl); 
  }
  
  addRoles(role:Roles): Observable<Roles>{
    return this.http.post<Roles>(environment.apiRolesUrl,role);
  }

  getRolesById(roleId : number): Observable<Roles>{
    return this.http.get<Roles>(`${environment.apiRolesUrl}/${roleId}`)
  }

  updateRoles(roleId:number, employeeRoles: Roles): Observable<Roles>{
    return this.http.put<Roles>(`${environment.apiRolesUrl}/${roleId}`,employeeRoles)
  }

  deleteRoles(roleId:number): Observable<void>{
    return this.http.delete<void>(`${environment.apiRolesUrl}/${roleId}`)
  }
}
