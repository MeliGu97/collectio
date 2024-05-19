import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseServerUrl } from '../collectio.constant';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  constructor(private http: HttpClient) {}

  // Trié par date
  getEvenements(): Observable<any[]> {
    return this.http.get<any[]>(`${baseServerUrl}/evenements`).pipe(
      map((evenements: any[]) => evenements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    );
  }

  getEvenementById(id: string): Observable<any> {
    return this.http.get(`${baseServerUrl}/evenements/${id}`);
  }

  getEvenementsByElementId(elementId: string): Observable<any[]> {
    return this.http.get<any[]>(`${baseServerUrl}/evenements?elementId=${elementId}`).pipe(
      map((evenements: any[]) => evenements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
    );
  }

  addEvenement(evenement: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/evenements`, evenement);
  }

  deleteEvenementById(id: string): Observable<any> {
    return this.http.delete(`${baseServerUrl}/evenements/${id}`);
  }
}
