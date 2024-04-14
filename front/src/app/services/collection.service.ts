import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { baseServerUrl } from '../collectio.constant'

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  constructor(private http: HttpClient) {}

  getCollections() {
    return this.http.get(`${baseServerUrl}/collections`)
  }

  getCollectionById(id: string): Observable<any> {
    return this.http.get(`${baseServerUrl}/collections/${id}`)
  }

  addCollection(collection: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/collections`, collection)
  }

  deleteCollectionById(id: string): Observable<any> {
    return this.http.delete(`${baseServerUrl}/collections/${id}`);
  }
}
