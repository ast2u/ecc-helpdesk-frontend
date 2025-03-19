import { Component, OnInit } from '@angular/core';
import { TicketSearchRequest } from '../../shared/model/searchrequest/ticket-search-request';
import { TicketsService } from './tickets.service';
import { Tickets } from '../../shared/model/tickets/tickets';
import { EmployeesService } from '../employees/employees.service';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../shared/components/pagination/pagination-component/pagination-component';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tickets',
  imports: [FormsModule, CommonModule, PaginationComponent, DatePipe, RouterModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css'
})
export class TicketsComponent implements OnInit {
  ticketList: Tickets [] = [];
  isLoading: boolean = true;
  activeFilters: { key: string, label: string, value: string }[] = [];
  totalPages = 0;
  currentPage = 0;
  pageSize = 5;
  searchRequest: TicketSearchRequest = {};

  constructor(private ticketService: TicketsService,
    private employeeService: EmployeesService){}
  
  ngOnInit(): void {
    this.getTickets();
  }

  getTickets(){
    this.activeFilters = this.ticketService.updateFilters(this.searchRequest);
    this.isLoading = true;
    this.ticketService.getUserTickets(this.searchRequest, this.currentPage, this.pageSize)
    .subscribe(response => {
      this.ticketList = response.content;
      this.totalPages = response.page.totalPages;
      this.isLoading = false;
    });
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


  
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.getTickets();
  }
  onEntriesChange() {
    this.currentPage = 0;
    this.getTickets();
  }

}
