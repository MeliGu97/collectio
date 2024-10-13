import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map, Observable, of, tap } from 'rxjs'

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

  getCurrentUtilisateurSecur(): Observable<any> {
    const token = localStorage.getItem('storage_token')
    if (token) {
      // console.log('Token trouvé dans localStorage')
      return this.http
        .get(`${baseServerUrl}/currentUtilisateur`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .pipe(
          tap((user) => {
            // console.log("Réponse de l'API:", user)
          }),
          map((user) => {
            // console.log("ID de l'utilisateur:", user)
            return user
          })
        )
    } else {
      // console.log('Aucun token trouvé dans localStorage')
      return this.http.get(`${baseServerUrl}/currentUtilisateur`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }
  }

  getUtilisateurById(id: string): Observable<any> {
    // console.log(`${baseServerUrl}/utilisateurs/${id}`);
    return this.http.get(`${baseServerUrl}/utilisateurs/${id}`)
  }

  addUtilisateur(utilisateur: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/utilisateurs`, utilisateur)
  }

  // UPDATE
  updateUtilisateur(utilisateur: any): Observable<any> {
    console.log('utilisateur :', utilisateur)
    console.log('ID de utilisateur :', utilisateur._id)
    return this.http.put(
      `${baseServerUrl}/utilisateurs/${utilisateur._id}`,
      utilisateur
    )
  }

  // supprimer toutes ses info / collection, fav etc
  deleteUtilisateurById(id: string): Observable<any> {
    return this.http.delete(`${baseServerUrl}/utilisateurs/${id}`)
  }

  connectUtilisateur(utilisateur: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/login`, utilisateur).pipe()
  }
}
