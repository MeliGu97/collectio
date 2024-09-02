import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'

import { baseServerUrl } from '../collectio.constant'

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  constructor(private http: HttpClient) {}

  getCollections(): Observable<any[]> {
    return this.http.get<any[]>(
      `${baseServerUrl}/collections?populate=periodesId`
    )
  }
  getCollectionsByUtilisateurId(userId: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${baseServerUrl}/collections?populate=periodesId`)
      .pipe(
        map((collections: any[]) =>
          collections.filter(
            (collection: { userId: String }) => collection.userId === userId
          )
        )
      )
    // return this.http.get<any[]>(`${baseServerUrl}/collections/user/${userId}`)
  }

  getCollectionsByPublicStatus(
    isPublic: boolean,
    userId?: string
  ): Observable<any[]> {
    let url = `${baseServerUrl}/collections?populate=periodesId`

    if (userId) {
      url += `&userId=${userId}`
    }

    return this.http.get<any[]>(url).pipe(
      map((collections: any[]) => {
        const filteredCollections = collections.filter(
          (collection: { public: boolean; userId: string }) =>
            collection.public === isPublic &&
            (!userId || collection.userId === userId)
        )
        // console.log('Filtered collections:', filteredCollections)
        return filteredCollections
      })
    )
  }

  getCollectionById(id: string): Observable<any> {
    return this.http.get<any>(
      `${baseServerUrl}/collections/${id}?populate=periodesId`
    )
  }

  // getColorPeriodesByCollectionId(id: string): Observable<any> {
  //   return this.http.get<any>(`${baseServerUrl}/collections/${id}/periodes/couleurs`);
  // }

  addCollection(collection: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/collections`, collection)
  }

  updateCollection(collection: any): Observable<any> {
    console.log('ID de la collection :', collection._id)
    return this.http.put(
      `${baseServerUrl}/collections/${collection._id}`,
      collection
    )
  }

  deleteCollectionById(id: string): Observable<any> {
    return this.http.delete(`${baseServerUrl}/collections/${id}`)
  }
}
