import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TicketsService } from '../../shared/services/tickets.service';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  createdTicketCount: number = 0;
  availableTicketCount: number = 0;
  assignedTicketCount: number = 0;
  unassignedTicketCount: number = 0;
  createdStatusCounts: { [key: string]: number } = {};
  assignedStatusCounts: { [key: string]: number } = {};
  isAdmin: boolean = false;
  currentUsername: string | null = null;

  constructor(private ticketService: TicketsService, private authService: AuthService){}
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdminUser();
    this.currentUsername = this.authService.getUsername();
    this.loadTicketCounts();
  }

  loadTicketCounts(): void {
    if(this.isAdmin){
      this.ticketService.getAvailableTicketCount().subscribe(count => {
        this.availableTicketCount = count;
      });
      
      this.ticketService.getUnassignedTicketCount().subscribe(count => {
        this.unassignedTicketCount = count;
      });

    }else{
      this.ticketService.getCreatedTicketCount().subscribe(count => {
        this.createdTicketCount = count;
      });
  
      this.ticketService.getAssignedTicketCount().subscribe(count => {
        this.assignedTicketCount = count;
      });
    }

    this.ticketService.getCreatedTicketStatusCount().subscribe(statusCounts => {
      this.createdStatusCounts = statusCounts;
    });

    this.ticketService.getAssignedTicketStatusCount().subscribe(statusCounts => {
      this.assignedStatusCounts = statusCounts;
    });
  }

  getBadge(status: string): string {
    return this.ticketService.getBadgeClass(status);
  }
}
