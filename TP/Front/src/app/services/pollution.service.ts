import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environnement } from '../environnements/environnement';
import { Pollution } from '../models/pollution.model'; 

@Injectable({
  providedIn: 'root'
})

export class PollutionService {

  private apiUrl = `${environnement.apiUrl}/api/pollution`;

  constructor(private http: HttpClient) { }

  searchPollutions(query: string): Observable<Pollution[]> {
    const url = `${this.apiUrl}?titre=${encodeURIComponent(query)}`;
    return this.http.get<Pollution[]>(url);
  }
    
  getPollutions(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.apiUrl);
  }

  getPollutionById(id: string | number): Observable<Pollution> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Pollution>(url);
  }
   
  createPollution(pollution: Pollution): Observable<Pollution> {
    return this.http.post<Pollution>(this.apiUrl, pollution);
  }

  updatePollution(id: number | string, pollution: Pollution): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, pollution);
  }

  deletePollution(id: number | string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}