import { Component, EventEmitter, inject, Output } from '@angular/core';
import { EmployeeSearchRequest } from '../../../shared/model/employee/employee-search-request';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filter-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './search-filter-modal.component.html',
  styleUrl: './search-filter-modal.component.css'
})
export class SearchFilterModalComponent {
  searchRequest: EmployeeSearchRequest = {};
  @Output() applyFiltersEvent = new EventEmitter<EmployeeSearchRequest>();
  @Output() removeFilterEvent = new EventEmitter<string>();
  @Output() clearFiltersEvent = new EventEmitter<void>();
  
  applyFilters() {
    this.applyFiltersEvent.emit(this.searchRequest);
    this.searchRequest= {};
  }

  removeFilter(key: string) {
    this.removeFilterEvent.emit(key);
  }

  clearFilters() {
    this.clearFiltersEvent.emit();
    this.searchRequest= {};
  }
}
