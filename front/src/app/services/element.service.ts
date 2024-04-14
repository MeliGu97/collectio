import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { baseServerUrl } from '../collectio.constant';

@Injectable({
  providedIn: 'root'
})
export class ElementService {
  
  constructor(private http: HttpClient) {}

  getElements(): Observable<any> {
    return this.http.get(`${baseServerUrl}/elements`)
  }

  getElementById(id: string): Observable<any> {
    console.log(`${baseServerUrl}/elements/${id}`);
    return this.http.get(`${baseServerUrl}/elements/${id}`);
  }

  addElement(element: any): Observable<any> {
    return this.http.post<any>(`${baseServerUrl}/elements`, element)
  }

  deleteElementById(id: string): Observable<any> {
    return this.http.delete(`${baseServerUrl}/elements/${id}`);
  }
}
