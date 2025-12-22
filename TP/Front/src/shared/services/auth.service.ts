import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../../app/models/utilisateur.model';
import { environnement } from '../../app/environnements/environnement';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = `${environnement.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  login(identifiant: string, motDePasse: string): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/login`, { identifiant, motDePasse });
  }

  estConnecte(): boolean {
    const token = localStorage.getItem('token'); 
    
    return !!token; 
  }

  getUtilisateurConnecte(): any {
      const userStr = localStorage.getItem('utilisateur');
      return userStr ? JSON.parse(userStr) : null;
  }
}