import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TicketSearchRequest } from '../../shared/model/searchrequest/ticket-search-request';
import { Observable } from 'rxjs';
import { Tickets } from '../../shared/model/tickets/tickets';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private apiUrlUser = 'http://localhost:8080/api/tickets/v1/me';
  private apiUrl = 'http://localhost:8080/api/tickets';
  constructor(private http: HttpClient) { }

  getUserTickets(searchRequest: TicketSearchRequest, page = 0, size = 0): Observable<{ content: Tickets[], page: any }> {
      const params = this.buildParams(searchRequest, page, size);
      return this.http.get<{ content: Tickets[], page: any }>(this.apiUrlUser, { params });
    }
  
  private buildParams(searchRequest: TicketSearchRequest, page: number, size: number): HttpParams {
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

  getTicketById(id : number) : Observable<Tickets>{
    return this.http.get<Tickets>(this.apiUrl + "/" + id)
  }

  updateTicketById(id:number, tickets: any) : Observable<Tickets>{
    return this.http.put<Tickets>(this.apiUrl + "/update/" + id, tickets)
  } 

}
