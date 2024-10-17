import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { baseServerUrl } from '../collectio.constant'

@Injectable({
  providedIn: 'root'
})
export class UneService {
  constructor(private http: HttpClient) {}

  getUnes(): Observable<any> {
    return this.http.get(`${baseServerUrl}/unes`)
  }

  getUneById(id: string): Observable<any> {
    return this.http.get(`${baseServerUrl}/unes/${id}?populate=collectionId`)
  }

  addUne(une: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/unes`, une)
  }

  deleteUneById(UneId: string): Observable<any> {
    return this.http.delete(`${baseServerUrl}/unes/${UneId}`)
  }
}
