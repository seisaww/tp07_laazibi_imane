import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

import { PollutionService } from '../../services/pollution.service';
import { Pollution } from '../../models/pollution.model';
import { AddFavori, RemoveFavori } from '../../../shared/actions/favoris-action';
import { FavorisState } from '../../../shared/states/favoris-state';

import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-liste-pollutions',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule], 
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.css'
})
export class PollutionList implements OnInit {
  pollutions: Pollution[] = [];
  filteredPollutions: Pollution[] = [];
  
  filterCriteria = {
    type: '', 
    lieu: '',
    date: ''
  };

  favorisIds: Signal<Set<number>>;
  
  isLoading: boolean = true;

  constructor(
    private pollutionService: PollutionService,
    private store: Store,
    public authService: AuthService
  ) {
    this.favorisIds = toSignal(
      this.store.select(FavorisState.getFavoris).pipe(
        map((favoris: Pollution[]) => new Set(favoris.map(p => p.id)))
      ),
      { initialValue: new Set<number>() }
    );
  }

  ngOnInit(): void {
    this.loadPollutions(); 
  }

  loadPollutions(): void {
    this.isLoading = true;

    this.pollutionService.getPollutions().subscribe({
      next: (data) => {
        this.pollutions = data;
        this.filteredPollutions = [...this.pollutions];
        this.applyFilters();
        
        this.isLoading = false; 
      },
      error: (error) => {
        console.error('Erreur de chargement:', error);
        this.isLoading = false; 
      }
    });
  }

  applyFilters(): void {
    this.filteredPollutions = this.pollutions.filter(pollution => {
      const typeMatch = !this.filterCriteria.type || pollution.type_pollution === this.filterCriteria.type;
      
      const lieuMatch = !this.filterCriteria.lieu || 
        (pollution.lieu && pollution.lieu.toLowerCase().includes(this.filterCriteria.lieu.toLowerCase()));
      
      const dateMatch = !this.filterCriteria.date || pollution.date_observation === this.filterCriteria.date;

      return typeMatch && lieuMatch && dateMatch;
    });
  }

  resetFilters() {
    this.filterCriteria = {
      type: '',
      lieu: '',
      date: ''
    };
    this.filteredPollutions = [...this.pollutions];
  }
  
  isFavori(pollutionId: number): boolean {
    return this.favorisIds().has(pollutionId);
  }

  toggleFavori(pollution: Pollution, event: Event): void {
    event.stopPropagation();
    if (this.isFavori(pollution.id)) {
      this.store.dispatch(new RemoveFavori(pollution.id));
    } else {
      this.store.dispatch(new AddFavori(pollution));
    }
  }
}