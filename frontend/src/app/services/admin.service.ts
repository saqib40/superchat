// src/app/services/admin.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiUrl}/Admin`;

  constructor(private http: HttpClient) {}

  getLeaders(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/leaders`);
  }

  createLeader(data: any): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/leaders`, data);
  }

  deleteLeader(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/leaders/${publicId}`);
  }
}