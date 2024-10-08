import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map, Observable, tap } from 'rxjs'
import { baseServerUrl } from '../collectio.constant'

@Injectable({
  providedIn: 'root'
})
export class FavorisService {
  constructor(private http: HttpClient) {}

  getFavoris(): Observable<any> {
    return this.http.get(`${baseServerUrl}/favoris`)
  }

  // Créer un favori pour un utilisateur
  createFavoris(favoris: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/favoris`, favoris)
  }

  // get basique
  getFavorisByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${baseServerUrl}/favorisUser/${userId}`)
  }

  // on ajoute une coll à la liste
  addCollectionToFavoris(
    userId: string,
    collectionId: string
  ): Observable<any> {
    // console.log('[service] userId :', userId)
    // console.log('[service] collectionId :', collectionId)

    return this.http.patch(`${baseServerUrl}/favorisUser/${userId}`, {
      collectionId
    })
  }

  // on enleve la coll des fav
  removeCollectionFromFavoris(userId: string, collectionId: string) {
    return this.http
      .patch(`${baseServerUrl}/favorisUserDelete/${userId}`, { collectionId })
      .pipe(
        tap((data) => {
          console.log(
            '[service] Identifiant de collection retiré des favoris avec succès !'
          )
        })
      )
  }
}
