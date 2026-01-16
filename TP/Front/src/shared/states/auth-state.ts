import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthConnexion, AuthDeconnexion } from '../actions/auth-action'; 
import { AuthStateModel } from './auth-state-model';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    accessToken: null,
    refreshToken: null, 
    user: null,
    connexion: false, 
  },
})
@Injectable()
export class AuthState {

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return state.connexion; 
  }
  
  @Selector()
  static accessToken(state: AuthStateModel): string | null {
    return state.accessToken; 
  }

  @Action(AuthConnexion)
  connexion(
    { patchState }: StateContext<AuthStateModel>, 
    { payload }: AuthConnexion 
  ) {
    
    patchState({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken, 
      user: payload.user, 
      connexion: true,
    });
  }
  
  @Action(AuthDeconnexion)
  deconnexion({ patchState }: StateContext<AuthStateModel>) {
      patchState({
          accessToken: null,
          refreshToken: null,
          user: null,
          connexion: false,
      });
  }
}