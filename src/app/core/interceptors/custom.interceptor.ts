import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const http = inject(HttpClient);
  const router = inject(Router);

  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true // Needed for refresh token stored in HTTP-only cookies
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/refresh')) {
        return refreshToken(http).pipe(
          switchMap((newToken: string | null) => {
            if (newToken) {
              console.log("Token refreshed successfully.");
              localStorage.setItem('token', newToken);
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next(retryReq);
            } else {
              console.warn("⚠️ Refresh token failed. Redirecting to login.");
              router.navigate(['/login']);
              return throwError(() => new Error('Session expired. Please log in again.'));
            }
          }),
          catchError(() => {
            router.navigate(['/login']);
            return throwError(() => new Error('Session expired. Please log in again.'));
          })
        );
      }
      return throwError(() => error);
    })
  );
};

function refreshToken(http: HttpClient): Observable<string | null> {
  return http.post<{ result: boolean, accessToken: string }>(
    'http://localhost:8080/refresh', 
    {}, 
    { withCredentials: true }
  ).pipe(
    switchMap(response => response.result ? of(response.accessToken) : of(null)), // ✅ Correctly return an Observable
    catchError(error => {
      console.error("❌ Error refreshing token:", error);
      return of(null); // ✅ Return null to prevent breaking the flow
    })
  );
}
