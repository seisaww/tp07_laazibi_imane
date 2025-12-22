import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AddFavori, RemoveFavori, ClearFavoris } from '../actions/favoris-action';
import { FavorisStateModel } from './favoris-state-model';
import { Pollution } from '../../app/models/pollution.model';
import { AuthDeconnexion } from '../actions/auth-action';

@State<FavorisStateModel>({
  name: 'favoris',
  defaults: {
    pollutions: []
  }
})

@Injectable()
export class FavorisState {
  
  @Selector()
  static getFavoris(state: FavorisStateModel): Pollution[] {
    return state.pollutions;
  }

  @Selector()
  static getFavorisCount(state: FavorisStateModel): number {
    return state.pollutions.length;
  }

  @Selector()
  static isFavori(state: FavorisStateModel) {
    return (pollutionId: number) => { 
      return state.pollutions.some(p => p.id === pollutionId);
    };
  }

  @Action(AddFavori)
  addFavori(
    { getState, patchState }: StateContext<FavorisStateModel>,
    { payload }: AddFavori
  ) {
    const state = getState();
    const exists = state.pollutions.some(p => p.id === payload.id);
    
    if (!exists) {
      patchState({
        pollutions: [...state.pollutions, payload]
      });
    }
  }

  @Action(RemoveFavori)
  removeFavori(
    { getState, patchState }: StateContext<FavorisStateModel>,
    { pollutionId }: RemoveFavori
  ) {
    const state = getState();
    patchState({
      pollutions: state.pollutions.filter(p => p.id !== pollutionId)
    });
  }

  @Action(ClearFavoris)
  clearFavoris({ patchState }: StateContext<FavorisStateModel>) {
    patchState({
      pollutions: []
    });
  }
 
}