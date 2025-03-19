import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tickets } from '../../../shared/model/tickets/tickets';
import { TicketsService } from '../tickets.service';

@Component({
  selector: 'app-ticket-detail',
  imports: [CommonModule, FormsModule, DatePipe, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit{
  ticketId!: number;
  ticket: Tickets | null = null;
  ticketFormUpdate: FormGroup = new FormGroup({
    id: new FormControl(0),
    title: new FormControl(""),
    body: new FormControl(""),
    status: new FormControl(""),
    assignee: new FormControl(null)
  })

  constructor(private route: ActivatedRoute, private ticketService: TicketsService, private router: Router){}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.ticketId = id ? +id : 0; // Convert to number and handle null case
    this.getTicketDetails();
    console.log('Ticket ID:', this.ticketId);
  }

  getTicketDetails(){
    this.ticketService.getTicketById(this.ticketId)
    .subscribe({
      next: (response: Tickets) => {
        this.ticket = response;
      },
      error: (err) => {
        if (err.status === 403) {
          console.warn('Unauthorized access! Redirecting...');
        } else if (err.status === 404) {
          console.warn('Ticket not found! Redirecting...');
        }

        // Redirect to /tickets on 403 (unauthorized) or 404 (not found)
        if (err.status === 403 || err.status === 404) {
          this.router.navigate(['/tickets']);
        }
      }

      
      
    });
  }

  editTicket(){
    this.ticketFormUpdate.reset();
    if (this.ticket) {
      this.ticketFormUpdate.patchValue({
        id: this.ticket.id,
        title: this.ticket.title,
        body: this.ticket.body,
        status: this.ticket.status,
        assignee: this.ticket.assignee
      });
    }
  }

  onUpdateTicket(){
    const formValue = this.ticketFormUpdate.value;
    debugger;
    this.ticketService.updateTicketById(formValue.id,FormData)
    .subscribe({
      next: (response) => {
        console.log('Ticket Updated:', response);
        alert('Ticket successfully updated!');
        this.getTicketDetails();
      },
      error: (err) => {
        console.error('Error updating employee:', err);
        alert('Failed to update employee');
      }
    })
  }

}
