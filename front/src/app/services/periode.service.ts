import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { baseServerUrl } from '../collectio.constant'

@Injectable({
  providedIn: 'root'
})
export class PeriodeService {
  constructor(private http: HttpClient) {}

  getPeriodes(): Observable<any[]> {
    return this.http
      .get<any[]>(`${baseServerUrl}/periodes`)
      .pipe(
        map((periodes: any[]) =>
          periodes.sort(
            (a, b) =>
              new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime()
          )
        )
      )
  }

  getPeriodeById(id: string): Observable<any> {
    // return this.http.get(`${baseServerUrl}/periodes/${id}`);
    return this.http
      .get<any[]>(`${baseServerUrl}/periodes/=${id}`)
      .pipe(
        map((periodes: any[]) =>
          periodes.sort(
            (a, b) =>
              new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime()
          )
        )
      )
  }

  addPeriode(periode: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/periodes`, periode)
  }

  deletePeriodeById(id: string): Observable<any> {
    return this.http.delete(`${baseServerUrl}/periodes/${id}`)
  }
}
