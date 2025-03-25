import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TicketSearchRequest } from '../model/searchrequest/ticket-search-request';
import { Observable } from 'rxjs';
import { Tickets } from '../model/tickets/tickets';
import { Remarks } from '../model/tickets/remarks';

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

  getAllTickets(searchRequest: TicketSearchRequest, page = 0, size = 0): Observable<{ content: Tickets[], page: any }> {
    const params = this.buildParams(searchRequest, page, size);
    return this.http.get<{ content: Tickets[], page: any }>(this.apiUrl, { params });
  }

  getCreatedTicketCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrlUser}/count/created`);
  }
  
  getAssignedTicketCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrlUser}/count/assigned`);
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

  createTicket(ticket:Tickets): Observable<Tickets>{
    return this.http.post<Tickets>(`${this.apiUrl}/create`,ticket)
  }

  getTicketById(id : number) : Observable<Tickets>{
    return this.http.get<Tickets>(`${this.apiUrl}/${id}`);
  }

  updateTicketById(id:number, tickets: Tickets) : Observable<Tickets>{
    return this.http.put<Tickets>(`${this.apiUrl}/update/${id}`, tickets);
  }

  assignTicketById(id:number, employeeId: number) : Observable<Tickets>{
    return this.http.put<Tickets>(`${this.apiUrl}/assign/${id}/${employeeId}`, null);
  }

  getCreatedTicketStatusCount(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrlUser}/count/status/created`);
  }
  
  getAssignedTicketStatusCount(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrlUser}/count/status/assigned`);
  }

  deleteTicketById(id:number) : Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addRemarksInTicket(ticketId:number, remarks: Remarks): Observable<Remarks>{
    return this.http.post<Remarks>(`${this.apiUrl}/${ticketId}/remarks/add`, remarks);
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'DRAFT': return 'bg-secondary';
      case 'FILED': return 'bg-primary';
      case 'IN_PROGRESS': return 'bg-warning text-dark';
      case 'CLOSED': return 'bg-dark';
      default: return 'bg-dark';
    }
  }
  
  updateFilters(searchRequest: TicketSearchRequest): { key: string, label: string, value: string }[] {
      const activeFilters: { key: string, label: string, value: string }[] = [];
      
      if (searchRequest.desc) {
        activeFilters.push({ key: 'desc', label: 'Description', value: searchRequest.desc });
      }
      if (searchRequest.status) {
        activeFilters.push({ key: 'status', label: 'Ticket Status', value: searchRequest.status });
      }
      if (searchRequest.ticketNumber) {
        activeFilters.push({ key: 'ticketNumber', label: 'Ticket Number', value: searchRequest.ticketNumber});
      }
      if (searchRequest.assignee) {
        activeFilters.push({ key: 'assignee', label: 'Assignee', value: searchRequest.assignee });
      }
      if (searchRequest.createdBy) {
        activeFilters.push({ key: 'createdBy', label: 'Created By', value: searchRequest.createdBy });
      }
      if (searchRequest.updatedBy) {
        activeFilters.push({ key: 'updatedBy', label: 'Updated By', value: searchRequest.updatedBy });
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
