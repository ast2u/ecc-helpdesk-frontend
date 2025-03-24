import { Component, OnInit } from '@angular/core';
import { TicketSearchRequest } from '../../shared/model/searchrequest/ticket-search-request';
import { TicketsService } from '../../shared/services/tickets.service';
import { Tickets } from '../../shared/model/tickets/tickets';
import { EmployeesService } from '../../shared/services/employees.service';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/components/pagination/pagination-component/pagination-component';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterModule} from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AddTicketModalComponent } from "./add-ticket-modal/add-ticket-modal.component";
import { Employees } from '../../shared/model/employee/employees';

@Component({
  selector: 'app-tickets',
  imports: [FormsModule, CommonModule, PaginationComponent, DatePipe, RouterModule, TitleCasePipe, AddTicketModalComponent],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {
  ticketList: Tickets [] = [];
  isLoading: boolean = true;
  isAdmin = false;
  activeFilters: { key: string, label: string, value: string }[] = [];
  totalPages = 0;
  currentPage = 0;
  availableEmployees: Employees[] = [];
  uniqueAssignees: string[] = [];
  uniqueUpdatedBy: string[] = [];
  pageSize = 5;
  searchRequest: TicketSearchRequest = {};
  ticketFormAdd: FormGroup = new FormGroup({
      id: new FormControl(""),
      title: new FormControl(""),
      body: new FormControl(""),
      status: new FormControl(null),
      assignee: new FormControl(null)
  })

  constructor(private ticketService: TicketsService,
    private employeeService: EmployeesService,
    private authService: AuthService){}
  
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdminUser();
    this.getTickets();
  }

  getTickets(){
    if(this.isAdmin){
      this.activeFilters = this.ticketService.updateFilters(this.searchRequest);
      this.isLoading = true;
      this.ticketService.getAllTickets(this.searchRequest, this.currentPage, this.pageSize)
        .subscribe(response => {
      this.ticketList = response.content;
      this.totalPages = response.page.totalPages;
      this.loadEmployee();
      this.extractUniqueAssignees();
      this.extractUniqueUpdatedBy()
      this.isLoading = false;
    });
    }else{
      this.activeFilters = this.ticketService.updateFilters(this.searchRequest);
      this.isLoading = true;
      this.ticketService.getUserTickets(this.searchRequest, this.currentPage, this.pageSize)
      .subscribe(response => {
      this.ticketList = response.content;
      this.totalPages = response.page.totalPages;
      this.extractUniqueAssignees();
      this.extractUniqueUpdatedBy()
      this.isLoading = false;
      });
    }
  }

  extractUniqueAssignees() {
    const usernames = this.ticketList
      .map(ticket => ticket.assignee?.username)
      .filter(username => username);
  
    this.uniqueAssignees = [...new Set(usernames)]; // Get unique usernames
  }

  extractUniqueUpdatedBy() {
    this.uniqueUpdatedBy = Array.from(
      new Set(this.ticketList.map(ticket => ticket.updatedBy).filter(username => username))
    );
  }

  onCreateTicket(){
    if(this.ticketFormAdd.valid){
      debugger
      const formData = { ...this.ticketFormAdd.value };
      this.ticketService.createTicket(formData).subscribe({
        next: (response) => {
          console.log('Ticket created:', response);
          alert('Ticket successfully created!');
          this.ticketFormAdd.reset();
          this.getTickets();
        },
        error: (err) => {
          console.error('Error creating ticket:', err);
          alert('Failed to create a ticket');
        }
      });
    }
  }

  applyFilters() {
    this.searchRequest = { ...this.searchRequest };
    this.onFilterChange();
  }

  removeFilter(key: string) {
    (this.searchRequest as any)[key] = null;
    this.onFilterChange();
  }

  clearFilters() {
    this.searchRequest = {};
    this.onFilterChange();
  }

  hasActiveFilters(): boolean {
    return this.activeFilters.length > 0;
  }

  onFilterChange() {
    this.currentPage = 0;
    this.getTickets();
  }

  getBadge(status: string): string {
    return this.ticketService.getBadgeClass(status);
  }

  loadEmployee() {
    if(this.isAdmin){
      this.employeeService.getAllEmployeeRaw().subscribe({
        next: (employee) => {
          this.availableEmployees = employee.content; // Store available roles
        },
        error: (err) => {
          console.error('Error fetching employees:', err);
        }
      });
    }
  }
  
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.getTickets();
  }
  onEntriesChange() {
    this.currentPage = 0;
    this.getTickets();
  }

}
