import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, map, tap } from 'rxjs'

import { baseServerUrl } from '../collectio.constant'

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  constructor(private http: HttpClient) {}

  // CRUD GET
  getCollections(): Observable<any[]> {
    return this.http.get<any[]>(
      `${baseServerUrl}/collections?populate=periodesId`
    )
  }

  getCollectionsPublicByUtilisateurId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${baseServerUrl}/collectionsPublicByUtili/user/${userId}`
    )
  }
  // passer en parametre le header : Authorization
  getCollectionsPrivateByUtilisateurId(
    userId: string,
    token: string
  ): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.get<any[]>(
      `${baseServerUrl}/collectionsPrivateByUtili/user/${userId}`,
      { headers }
    )
  }

  getAllPublicCollections(): Observable<any[]> {
    let url = `${baseServerUrl}/collectionsPublic?populate=periodesId`
    return this.http.get<any[]>(url)
  }

  getCollectionById(id: string): Observable<any> {
    return this.http.get<any>(
      `${baseServerUrl}/collections/${id}?populate=periodesId`
    )
  }

  getCollectionsUtilisateurByPeriodeId(
    periodeId: string,
    userId: string
  ): Observable<any[]> {
    return this.http
      .get<any[]>(`${baseServerUrl}/collections?populate=periodesId`)
      .pipe(
        map((collections: any[]) => {
          const filteredCollections = collections.filter(
            (collection) =>
              collection.periodesId.some(
                (period: any) => period._id === periodeId
              ) && collection.userId === userId
          )
          console.log(
            'total Coll qui répondent à ce filtre:',
            filteredCollections
          )
          return filteredCollections
        })
      )
  }

  // getColorPeriodesByCollectionId(id: string): Observable<any> {
  //   return this.http.get<any>(`${baseServerUrl}/collections/${id}/periodes/couleurs`);
  // }

  // Annexe :
  makePagination(
    collections: any[],
    page: number = 1,
    limit: number = 4
  ): any[] {
    return collections.slice((page - 1) * limit, page * limit)
  }

  // LES AUTRES CRUDS
  // POST
  addCollection(collection: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/collections`, collection)
  }

  // UPDATE
  updateCollection(collection: any): Observable<any> {
    console.log('ID de la collection :', collection._id)
    return this.http.put(
      `${baseServerUrl}/collections/${collection._id}`,
      collection
    )
  }

  updateCollectionPublic(
    collectionId: string,
    isPublic: boolean
  ): Observable<any> {
    return this.http.put(`${baseServerUrl}/collections/${collectionId}`, {
      public: isPublic
    })
  }

  updateCollectionSignalement(
    collectionId: string,
    Issignalement: boolean
  ): Observable<any> {
    return this.http.put(`${baseServerUrl}/collections/${collectionId}`, {
      signalement: Issignalement
    })
  }

  // DELETE
  deleteCollectionById(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.delete(`${baseServerUrl}/collections/${id}`, { headers })
  }
}
