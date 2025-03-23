import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tickets } from '../../shared/model/tickets/tickets';
import { TicketsService } from '../../shared/services/tickets.service';
import { EmployeesService } from '../../shared/services/employees.service';
import { Employees } from '../../shared/model/employee/employees';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-ticket-detail',
  imports: [CommonModule, FormsModule, DatePipe, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit{
  ticketId!: number;
  ticket: Tickets | null = null;
  isAdmin: boolean = false;
  isAssigning = false;
  isEditing = false;
  availableEmployees: Employees[] = [];
  ticketFormUpdate: FormGroup = new FormGroup({
    id: new FormControl(0),
    title: new FormControl(""),
    body: new FormControl(""),
    status: new FormControl(""),
    assignee: new FormControl(null)
  })
  remarksForm: FormGroup = new FormGroup({
    comment: new FormControl("")
  })

  constructor(private route: ActivatedRoute, 
    private ticketService: TicketsService, 
    private employeeService : EmployeesService, 
    private authService : AuthService,
    private router: Router){}


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.ticketId = id ? + id : 0; // Convert to number and handle null case
    this.isAdmin = this.authService.isAdminUser();
    this.getTicketDetails();
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

  onAssignEmployeeClick(){
    this.isAssigning = true;
    this.loadEmployee();
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
    this.isEditing = true;
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
  
  cancelEdit(){
    this.isEditing = false;
  }

  onUpdateTicket(){
    if (this.ticketFormUpdate.valid) {
      debugger
      const updatedTicket = this.ticketFormUpdate.value;
      this.ticketService.updateTicketById(updatedTicket.id, updatedTicket)
        .subscribe({
          next: (response) => {
            console.log('Ticket Updated:', response);
            alert('Ticket successfully updated!');
            this.getTicketDetails(); // Refresh data
            this.isEditing = false; // Exit edit mode
          },
          error: (err) => {
            console.error('Error updating ticket:', err);
            alert('Failed to update ticket');
          }
        });
    }
  }

  assignToTicket(employeeId: number) {
    if (!this.ticket || !this.ticket.id) {
      console.error("No ticket selected for assignment.");
      return;
    }
    debugger
  
    this.isAssigning = true;
  
    this.ticketService.assignTicketById(this.ticket.id, employeeId).subscribe({
      next: (updatedTicket) => {
        console.log("Ticket assigned successfully:", updatedTicket);
        this.ticket = updatedTicket; // Update the UI with the new assigned ticket
        alert("Ticket successfully assigned!");
        this.isAssigning = false; // Reset assigning state
      },
      error: (err) => {
        console.error("Error assigning ticket:", err);
        alert("Failed to assign ticket.");
        this.isAssigning = false; // Reset assigning state
      }
    });
  }

  onConfirmDelete(ticketId : number): void {
    if (confirm('Are you sure you want to delete this Ticket?')) {
      this.deleteTicket(ticketId);
    }
  }

  deleteTicket(ticketId : number){
    this.ticketService.deleteTicketById(ticketId).subscribe({
      next: () => {
        alert('Ticket deleted successfully!');
        this.router.navigate(['/tickets']);
      },
      error: (err) => {
        console.error('Error deleting ticket:', err);
        alert('Failed to delete ticket.');
      }
    })
    
  }

  onEnterAddRemarks(event: Event, ticketId: number) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    this.onSubmitAddRemark(ticketId);
  }
  

  onSubmitAddRemark(ticketId:number){
    if(this.remarksForm.valid){
      debugger
      const formData = {...this.remarksForm.value}
      this.ticketService.addRemarksInTicket(ticketId,formData).subscribe({
        next: (response) => {
          console.log('Remark created:', response);
          this.remarksForm.reset();
          this.getTicketDetails();
        },
        error: (err) => {
          console.error('Error creating remark:', err);
          alert('Failed to create a remark');
        }
      });
    }
  }

  getBadge(status: string): string {
    return this.ticketService.getBadgeClass(status);
  }

}
