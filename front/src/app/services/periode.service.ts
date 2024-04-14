import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { baseServerUrl } from '../collectio.constant';

@Injectable({
  providedIn: 'root'
})
export class PeriodeService {
  constructor(private http: HttpClient) {}

  getPeriodes() {
    return this.http.get(`${baseServerUrl}/periodes`)
  }

  getPeriodeById(id: string): Observable<any> {
    console.log(`${baseServerUrl}/periodes/${id}`);
    return this.http.get(`${baseServerUrl}/periodes/${id}`);
  }

  addPeriode(periode: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/periodes`, periode)
  }

  deletePeriodeById(id: string): Observable<any> {
    return this.http.delete(`${baseServerUrl}/periodes/${id}`);
  }
}
