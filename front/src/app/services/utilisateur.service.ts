import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, tap } from 'rxjs'
import { baseServerUrl } from '../collectio.constant'

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  constructor(private http: HttpClient) {}

  getUtilisateurs(): Observable<any> {
    return this.http.get(`${baseServerUrl}/utilisateurs`)
  }

  getCurrentUtilisateur(): any {
    const user = localStorage.getItem('storage_user_id')
    // console.log('storage_user_id:', user)
    return user ? { _id: user } : {}
  }

  getUtilisateurById(id: string): Observable<any> {
    // console.log(`${baseServerUrl}/utilisateurs/${id}`);
    return this.http.get(`${baseServerUrl}/utilisateurs/${id}`)
  }

  addUtilisateur(utilisateur: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/utilisateurs`, utilisateur)
  }

  deleteUtilisateurById(id: string): Observable<any> {
    return this.http.delete(`${baseServerUrl}/utilisateurs/${id}`)
  }

  connectUtilisateur(utilisateur: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/login`, utilisateur).pipe()
  }
}
