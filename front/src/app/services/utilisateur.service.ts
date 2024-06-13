import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { baseServerUrl } from '../collectio.constant';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  constructor(
    private http: HttpClient
  ) {}

  getUtilisateurs(): Observable<any> {
    return this.http.get(`${baseServerUrl}/utilisateurs`)
  }

  getUtilisateurById(id: string): Observable<any> {
    // console.log(`${baseServerUrl}/utilisateurs/${id}`);
    return this.http.get(`${baseServerUrl}/utilisateurs/${id}`);
  }
  
  addUtilisateur(utilisateur: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/utilisateurs`, utilisateur);
  }

  deleteUtilisateurById(id: string): Observable<any> {
    return this.http.delete(`${baseServerUrl}/utilisateurs/${id}`);
  }
}
