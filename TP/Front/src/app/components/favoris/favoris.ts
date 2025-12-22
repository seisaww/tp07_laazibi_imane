  import { Component, Signal } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RouterModule } from '@angular/router';
  import { Store } from '@ngxs/store';
  import { toSignal } from '@angular/core/rxjs-interop';

  import { Pollution } from '../../models/pollution.model';
  import { FavorisState } from '../../../shared/states/favoris-state';
  import { RemoveFavori, ClearFavoris } from '../../../shared/actions/favoris-action';

  @Component({
    selector: 'app-favoris',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './favoris.html',
    styleUrls: ['./favoris.css']
  })

  export class Favoris {
    favoris: Signal<Pollution[]>;
    favorisCount: Signal<number>;

    constructor(private store: Store) {
      this.favoris = toSignal(
        this.store.select(FavorisState.getFavoris),
        { initialValue: [] }
      );
      
      this.favorisCount = toSignal(
        this.store.select(FavorisState.getFavorisCount),
        { initialValue: 0 }
      );
    }

    removeFavori(pollutionId: number): void {
      if (confirm('Voulez-vous retirer cette pollution de vos favoris ?')) {
        this.store.dispatch(new RemoveFavori(pollutionId));
      }
    }

    clearAllFavoris(): void {
      if (this.favorisCount() > 0 && 
          confirm(`Voulez-vous supprimer tous vos ${this.favorisCount()} favoris ?`)) {
        this.store.dispatch(new ClearFavoris());
      }
    }
  }