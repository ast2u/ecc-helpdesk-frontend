import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-ticket-modal',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './add-ticket-modal.component.html',
  styleUrl: './add-ticket-modal.component.css'
})
export class AddTicketModalComponent {
  @Input() ticketFormAdd!: FormGroup;
  @Output() createTicket = new EventEmitter<void>();

  onCreateTicket() {
    this.createTicket.emit(); // Notify the parent to create an employee
  }
}
