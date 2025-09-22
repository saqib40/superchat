import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LeadershipService } from '../../../services/leadership.service';
import { SearchResult } from '../../../models';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './search-page.component.html'
})
export class SearchPageComponent {
  searchForm: FormGroup;
  searchResults: SearchResult[] = [];
  isLoading = false;
  hasSearched = false;

  constructor(
    private fb: FormBuilder,
    private leadershipService: LeadershipService
  ) {
    this.searchForm = this.fb.group({
      type: [''],
      query: ['']
    });
  }

  onSearch() {
    const { type, query } = this.searchForm.value;
    
    if (!query.trim()) {
      return;
    }

    this.isLoading = true;
    this.hasSearched = true;
    
    this.leadershipService.search(type, query.trim()).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error searching:', error);
        this.searchResults = [];
        this.isLoading = false;
      }
    });
  }

  clearSearch() {
    this.searchForm.reset();
    this.searchResults = [];
    this.hasSearched = false;
  }

  getResultIcon(type: string): string {
    return type === 'vendor' ? '🏢' : '👤';
  }
}
