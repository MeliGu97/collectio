import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseServerUrl } from '../collectio.constant';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  constructor(private http: HttpClient) {}

  getCollections(): Observable<any[]> {
    return this.http.get<any[]>(`${baseServerUrl}/collections?populate=periodesId`);
  }

  getCollectionById(id: string): Observable<any> {
    return this.http.get<any>(`${baseServerUrl}/collections/${id}?populate=periodesId`);
  }

  // getColorPeriodesByCollectionId(id: string): Observable<any> {
  //   return this.http.get<any>(`${baseServerUrl}/collections/${id}/periodes/couleurs`);
  // }

  addCollection(collection: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/collections`, collection);
  }

  deleteCollectionById(id: string): Observable<any> {
    return this.http.delete(`${baseServerUrl}/collections/${id}`);
  }
}
