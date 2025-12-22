import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../environnements/environnement';
import { Utilisateur } from '../models/utilisateur.model'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environnement.apiUrl}/api/utilisateur`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUrl);
  }

  getUserById(id: string | number): Observable<Utilisateur> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Utilisateur>(url);
  }

  createUser(user: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.apiUrl, user);
  }

}