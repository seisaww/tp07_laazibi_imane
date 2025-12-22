import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AuthConnexion, AuthDeconnexion, AuthPayload } from '../actions/auth-action'; 
import { AuthStateModel } from './auth-state-model';

const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    accessToken: null, 
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
    connexion: !!localStorage.getItem(REFRESH_TOKEN_KEY), 
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
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
    patchState({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
      user: payload.user,
      connexion: true,
    });
  }
  
  @Action(AuthDeconnexion)
  deconnexion({ patchState }: StateContext<AuthStateModel>) {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      patchState({
          accessToken: null,
          refreshToken: null,
          user: null,
          connexion: false,
      });
  }
}