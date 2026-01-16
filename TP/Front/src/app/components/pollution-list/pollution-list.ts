import { Component, OnInit, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, startWith, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { PollutionService } from '../../services/pollution.service';
import { Pollution } from '../../models/pollution.model';
import { AddFavori, RemoveFavori } from '../../../shared/actions/favoris-action';
import { FavorisState } from '../../../shared/states/favoris-state';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-liste-pollutions',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule], 
  templateUrl: './pollution-list.html',
  styleUrl: './pollution-list.css'
})
export class PollutionList implements OnInit {
  
  private pollutionService = inject(PollutionService);
  private store = inject(Store);
  public authService = inject(AuthService);

  searchControl = new FormControl('');

  pollutions: Pollution[] = [];         
  filteredPollutions: Pollution[] = []; 
  isLoading: boolean = true;

  filterCriteria = {
    type: '', 
    lieu: '',
    date: ''
  };

  favorisIds: Signal<Set<number>>;

  constructor() {
    this.favorisIds = toSignal(
      this.store.select(FavorisState.getFavoris).pipe(
        map((favoris: Pollution[]) => new Set(favoris.map(p => p.id)))
      ),
      { initialValue: new Set<number>() }
    );
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      startWith(''),          
      debounceTime(300),      
      distinctUntilChanged(), 
      switchMap(term => {
        this.isLoading = true;
        return this.pollutionService.searchPollutions(term || '').pipe(
          catchError(err => {
            console.error(err);
            return of([]); 
          })
        );
      })
    ).subscribe(data => {
      this.pollutions = data; 
      this.applyFilters();
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    this.filteredPollutions = this.pollutions.filter(pollution => {
      const typeMatch = !this.filterCriteria.type || pollution.type_pollution === this.filterCriteria.type;
      
      const lieuMatch = !this.filterCriteria.lieu || 
        (pollution.lieu && pollution.lieu.toLowerCase().includes(this.filterCriteria.lieu.toLowerCase()));
      
      const dateMatch = !this.filterCriteria.date || 
        (pollution.date_observation && pollution.date_observation.toString().startsWith(this.filterCriteria.date));

      return typeMatch && lieuMatch && dateMatch;
    });
  }

  resetFilters() {
    this.filterCriteria = { type: '', lieu: '', date: '' };
    this.searchControl.setValue(''); 
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