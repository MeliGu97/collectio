import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = 'https://api.pexels.com/v1/'
  private apiKey = 'eEXfdIUcfQLtm3baMX9LZnkdbu0PnpnKXSPYCtyVAir5JX8dIY3HB5ad'

  constructor(private http: HttpClient) {}

  // Pour afficher une liste de photo en fonction d'un mot clef
  getPhotos(query: string, perPage: number, page: number): Observable<any> {
    const headers = { Authorization: this.apiKey }
    const params = { query, per_page: perPage, page }
    return this.http.get(`${this.apiUrl}search`, { headers, params })
  }

  // Pour afficher les photos selectionnées par l'équipe pexels
  photosCurated(perPage: number, page: number): Observable<any> {
    const headers = { Authorization: this.apiKey }
    const params = { per_page: perPage, page }
    return this.http.get(`${this.apiUrl}curated`, { headers, params })
  }

  // pôur récupérer la photo en fonction de son id
  getPhoto(id: number): Observable<any> {
    const headers = { Authorization: this.apiKey }
    return this.http.get(`${this.apiUrl}photos/${id}`, { headers })
  }
}
