import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { baseServerUrl } from '../collectio.constant';

@Injectable({
  providedIn: 'root'
})
export class EvenementService {
  constructor(private http: HttpClient) {}

  getEvenements() {
    return this.http.get(`${baseServerUrl}/evenements`)
  }

  getEvenementById(id: string): Observable<any> {
    console.log(`${baseServerUrl}/evenements/${id}`);
    return this.http.get(`${baseServerUrl}/evenements/${id}`);
  }

  addEvenement(evenement: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/evenements`, evenement)
  }

  deleteEvenementById(id: string): Observable<any> {
    return this.http.delete(`${baseServerUrl}/evenements/${id}`);
  }

}
