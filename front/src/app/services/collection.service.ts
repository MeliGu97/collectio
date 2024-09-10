import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map, tap } from 'rxjs'

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

  getCollectionsPublicByUtilisateurId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${baseServerUrl}/collectionsPublicByUtili/user/${userId}`
    )
  }
  getCollectionsPrivateByUtilisateurId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${baseServerUrl}/collectionsPrivateByUtili/user/${userId}`
    )
  }

  // getCollectionsUtiliByPublicStatus(
  //   isPublic: boolean,
  //   userId?: string
  // ): Observable<any[]> {
  //   let url = `${baseServerUrl}/collections?populate=periodesId`

  //   if (userId) {
  //     url += `&userId=${userId}`
  //   }

  //   return this.http.get<any[]>(url).pipe(
  //     map((collections: any[]) => {
  //       const filteredCollections = collections.filter(
  //         (collection: { public: boolean; userId: string }) =>
  //           collection.public === isPublic &&
  //           (!userId || collection.userId === userId)
  //       )
  //       // console.log('Filtered collections:', filteredCollections)
  //       return filteredCollections
  //     })
  //   )
  // }

  getAllPublicCollections(): Observable<any[]> {
    let url = `${baseServerUrl}/collectionsPublic?populate=periodesId`
    return this.http.get<any[]>(url)
  }

  makePagination(
    collections: any[],
    page: number = 1,
    limit: number = 4
  ): any[] {
    return collections.slice((page - 1) * limit, page * limit)
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
