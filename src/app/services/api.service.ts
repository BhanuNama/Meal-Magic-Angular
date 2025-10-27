import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  /**
   * Gets headers with authentication token if available
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Get token from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user.token) {
          headers = headers.set('Authorization', `Bearer ${user.token}`);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    return headers;
  }

  /**
   * Performs GET request
   */
  get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Performs POST request
   */
  post<T>(url: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, data, {
      headers: this.getHeaders()
    });
  }

  /**
   * Performs PUT request
   */
  put<T>(url: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${url}`, data, {
      headers: this.getHeaders()
    });
  }

  /**
   * Performs DELETE request
   */
  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${url}`, {
      headers: this.getHeaders()
    });
  }
}

