import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'

import { baseServerUrl } from '../collectio.constant'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}
  private userSubject = new Subject<any>()
  user$ = this.userSubject.asObservable()

  verifyToken(token: string): Observable<any> {
    return this.http.post(`${baseServerUrl}/verify-token`, { token })
  }

  login(user: any) {
    this.userSubject.next(user)
  }

  logout() {
    this.userSubject.next(null)
  }
}
