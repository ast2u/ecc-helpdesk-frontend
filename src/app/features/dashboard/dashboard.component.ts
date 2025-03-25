import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Tickets } from '../../shared/model/tickets/tickets';
import { TicketsService } from '../../shared/services/tickets.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  createdTicketCount: number = 0;
  assignedTicketCount: number = 0;
  createdStatusCounts: { [key: string]: number } = {};
  assignedStatusCounts: { [key: string]: number } = {};

  constructor(private ticketService: TicketsService){}
  ngOnInit(): void {
      this.loadTicketCounts();
  }

  loadTicketCounts(): void {
    this.ticketService.getCreatedTicketCount().subscribe(count => {
      this.createdTicketCount = count;
    });

    this.ticketService.getAssignedTicketCount().subscribe(count => {
      this.assignedTicketCount = count;
    });

    this.ticketService.getCreatedTicketStatusCount().subscribe(statusCounts => {
      this.createdStatusCounts = statusCounts;
    });

    this.ticketService.getAssignedTicketStatusCount().subscribe(statusCounts => {
      this.assignedStatusCounts = statusCounts;
    });
  }
}
