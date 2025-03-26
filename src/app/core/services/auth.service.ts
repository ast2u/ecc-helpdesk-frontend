import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private roleApiUrl = 'http://localhost:8080/api/employees/roles';
  private apiUrl = 'http://localhost:8080';
  private employeeUrl = 'http://localhost:8080/api/employees/profile';
  private tokenKey = 'token';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }, { withCredentials: true }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.accessToken);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return of({ token: null, message: error.error?.message || "Login failed" });
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    window.location.href = '/login';
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.accessToken);
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.logout(); // Force logout if refresh fails
        return of({ token: null });
      })
    );
  }

  changeProfileCredentials(request: { 
    username: string; 
    oldPassword: string; 
    newPassword: string }): 
    Observable<{
      message: string; 
      status: string; 
      logout: boolean}> {
    return this.http.put<{message: string; status: string; logout: boolean}>
    (`${this.employeeUrl}/change-credentials`, request);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;

    try {
      const decodedToken: any = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < Date.now();

      if (isExpired) {
        this.refreshToken().subscribe(); // Automatically log out if expired
        return false;
      }
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  getRolesFromToken(token: string): string[] {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.roles || []; // ✅ Extract roles from token (if present)
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }

  isAdminUser(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;
  
    const roles = this.getRolesFromToken(token);
    return roles.includes('ADMIN'); // Adjust based on actual role names
  }

  getToken(): string | null {
    return localStorage.getItem('token'); // Assuming token is stored in localStorage
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken?.sub || null; // Assuming the username is stored in `sub` field
    }
    return null;
  }

  // getUserRoles(): Observable<string[]> {
  //   const token = localStorage.getItem('helpdesk-token'); // Get JWT from local storage

  //   if (!token) {
  //     throw new Error('No token found');
  //   }

  //   let roles: string[] = this.getRolesFromToken(token);

  //   if (roles.length > 0) {
  //     // ✅ If roles exist in JWT, return them immediately
  //     return of(roles);
  //   }

  //   // ❌ If roles are missing, fetch from the database
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   return this.http.get<string[]>(this.roleApiUrl, { headers }).pipe(
  //     catchError((error) => {
  //       console.error('Error fetching roles:', error);
  //       return of([]); // Return an empty array on error
  //     })
  //   );
  // }
}
