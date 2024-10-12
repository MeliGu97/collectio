import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

import { baseServerUrl } from '../collectio.constant'

@Injectable({
  providedIn: 'root'
})
export class SignalementService {
  constructor(private http: HttpClient) {}

  createSignalement(signalement: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/signalements`, signalement)
  }

  getAllSignalements(): Observable<any[]> {
    return this.http.get<any[]>(`${baseServerUrl}/signalements`)
  }

  getSignalementByCollectionId(collectionId: string): Observable<any> {
    return this.http.get(
      `${baseServerUrl}/signalementCollection/${collectionId}`
    )
  }

  updateSignalement(signalement: any): Observable<any> {
    // console.log('ID du signalement :', signalement._id)
    return this.http.put(
      `${baseServerUrl}/signalementCollection/${signalement._id}`,
      signalement
    )
  }

  deleteSignalementBySignalementId(signalementId: string): Observable<any> {
    return this.http.delete(
      `${baseServerUrl}/signalementCollection/${signalementId}`
    )
  }
}
