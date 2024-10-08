import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, map } from 'rxjs'
import { baseServerUrl } from '../collectio.constant'

@Injectable({
  providedIn: 'root'
})
export class ElementService {
  constructor(private http: HttpClient) {}

  getElements(): Observable<any> {
    return this.http.get(`${baseServerUrl}/elements`)
  }

  getElementById(id: string): Observable<any> {
    // console.log(`${baseServerUrl}/elements/${id}`);
    return this.http.get(`${baseServerUrl}/elements/${id}`)
  }

  getElementsByCollectionId(collectionId: string): Observable<any[]> {
    return this.http
      .get<any[]>(`${baseServerUrl}/elements`)
      .pipe(
        map((elements) =>
          elements.filter((element) =>
            element.collectionsId.includes(collectionId)
          )
        )
      )
  }

  addElement(element: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.post<any>(`${baseServerUrl}/elements`, element, {
      headers
    })
  }

  updateElement(element: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token
    })
    console.log('ID de la element :', element._id)
    return this.http.put<any>(
      `${baseServerUrl}/elements/${element._id}`,
      element,
      { headers }
    )
  }

  deleteElementById(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token
    })
    return this.http.delete(`${baseServerUrl}/elements/${id}`, { headers })
  }
}
