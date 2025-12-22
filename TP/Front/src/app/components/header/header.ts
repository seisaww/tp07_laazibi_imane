import { Component, Signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { FavorisState } from '../../../shared/states/favoris-state';
import { AuthState } from '../../../shared/states/auth-state';
import { AuthDeconnexion } from '../../../shared/actions/auth-action';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  favorisCount: Signal<number>;
  connexion: Signal<boolean>;
  user: Signal<any>; 

  constructor(private store: Store, private router: Router) {
    this.favorisCount = toSignal(
      this.store.select(FavorisState.getFavorisCount), 
      { initialValue: 0 }
    );

    this.connexion = toSignal(
      this.store.select(AuthState.isAuthenticated), 
      { initialValue: false }
    );

    this.user = toSignal(
      this.store.select(state => state.auth.user), 
      { initialValue: null }
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.store.dispatch(new AuthDeconnexion());
    this.router.navigate(['/login']);
  }
}