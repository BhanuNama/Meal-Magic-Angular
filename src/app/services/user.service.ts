import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) {}

  /**
   * User login
   */
  login(credentials: LoginRequest): Observable<any> {
    return this.apiService.post<any>('/user/login', credentials);
  }

  /**
   * User signup/registration
   */
  signup(user: User): Observable<any> {
    return this.apiService.post<any>('/user/register', user);
  }

  /**
   * Get all users
   */
  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('/user/getAllUsers');
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`/user/getUserById/${id}`);
  }
}

