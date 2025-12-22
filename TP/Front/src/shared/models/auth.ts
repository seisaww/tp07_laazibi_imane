import { Utilisateur } from '../../app/models/utilisateur.model'; 

export interface Auth {
  connexion: boolean;
  accessToken: string | null;     
  refreshToken: string | null;   
  user: Utilisateur | null;       
}