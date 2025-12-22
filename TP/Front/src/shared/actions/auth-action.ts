import { Utilisateur } from '../../app/models/utilisateur.model';

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: Utilisateur;
}

export class AuthConnexion {
  static readonly type = '[Auth] Connexion';
  constructor(public payload: AuthPayload) {} 
}

export class AuthDeconnexion {
  static readonly type = '[Auth] Deconnexion';
}