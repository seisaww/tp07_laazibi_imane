import { Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; 
import { CommonModule, DatePipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

import { Pollution } from '../../models/pollution.model';
import { PollutionService } from '../../services/pollution.service';
import { PollutionFrom } from '../pollution-form/pollution-from';
import { AddFavori, RemoveFavori } from '../../../shared/actions/favoris-action';
import { FavorisState } from '../../../shared/states/favoris-state';

import { AuthService } from '../../../shared/services/auth.service';


@Component({
  selector: 'app-pollution-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, PollutionFrom],
  templateUrl: './pollution-detail.html',
  styleUrl: './pollution-detail.css'
})
export class PollutionDetail implements OnInit {
  
  pollution: Pollution | null = null;
  pollutionToEdit: Pollution | null = null;
  favorisIds: Signal<Set<number>>;
  isLoading: boolean = true; 
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPollution(id);
    } else {
      this.isLoading = false;
    }
  }

  loadPollution(id: string): void {
    this.isLoading = true;
    this.pollutionService.getPollutionById(id).subscribe({
      next: (data: Pollution) => {
        this.pollution = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur:', error);
        this.pollution = null;
        this.isLoading = false;
      }
    });
  }

  isFavori(): boolean {
    return this.pollution ? this.favorisIds().has(this.pollution.id) : false;
  }

  toggleFavori(): void {
    if (!this.pollution) return;
    if (this.isFavori()) {
      this.store.dispatch(new RemoveFavori(this.pollution.id));
    } else {
      this.store.dispatch(new AddFavori(this.pollution));
    }
  }
  
  editPollution(): void {
    if (!this.authService.estConnecte()) {
        this.router.navigate(['/login'], { queryParams: { error: 'auth_required' } });
        return;
    }

    if (this.pollution) {
      this.successMessage = null;
      this.pollutionToEdit = {...this.pollution};
    }
  }
  
  cancelEdit(): void {
    this.pollutionToEdit = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  handlePollutionUpdated(updatedPollution: Pollution): void {
    this.pollution = updatedPollution;
    this.cancelEdit();
    this.successMessage = "Signalement modifié avec succès !";
  }

  deletePollution(): void {
    if (!this.authService.estConnecte()) {
        this.router.navigate(['/login'], { queryParams: { error: 'auth_required' } });
        return;
    }

    if (this.pollution && confirm('Êtes-vous sûr de vouloir supprimer cette pollution ?')) {
      this.pollutionService.deletePollution(this.pollution.id).subscribe({
        next: () => {
          this.router.navigate(['pollutions/liste']);
        },
        error: (error) => console.error('Erreur suppression:', error)
      });
    }
  }
}